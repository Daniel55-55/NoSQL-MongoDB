"""
============================================================
PASO 2 — ETL: MongoDB → SQLite (almacen.sqlite)

Fases:
  EXTRACCION  → lee de las 3 bases MongoDB distribuidas
  TRANSFORMACION → valida tipos, FK, elimina _id MongoDB
  CARGA        → inserta en SQLite en orden correcto:
                 personas y articulos (tablas padre) primero,
                 ventas (tabla hija) después
============================================================
Uso: python scripts/02_etl_mongo_sqlite.py
"""

import sqlite3, os, sys
from datetime import datetime

try:
    from pymongo import MongoClient
    MONGO_OK = True
except ImportError:
    MONGO_OK = False

BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQLITE_PATH = os.path.join(BASE_DIR, "data", "almacen.sqlite")
LOG_PATH    = os.path.join(BASE_DIR, "data", "debug.log")
os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)

# ── Logger ───────────────────────────────────────────────
def log(msg, level="INFO"):
    ts   = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] [{level}] {msg}"
    print(line)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")

# ════════════════════════════════════════════════════════
# FASE 1 — EXTRACCION desde MongoDB
# ════════════════════════════════════════════════════════
def extract():
    log("=== FASE EXTRACCION ===", "INFO")
    t0 = datetime.now()

    def fetch(host, port, db_name, col_name):
        try:
            c   = MongoClient(host=host, port=port, serverSelectionTimeoutMS=3000)
            c.server_info()
            docs = list(c[db_name][col_name].find())
            c.close()
            log(f"  GET {host}:{port}/{db_name}.{col_name} → {len(docs)} documentos OK")
            return docs
        except Exception as e:
            log(f"  Error {host}:{port} → {e}", "ERROR")
            return []

    if not MONGO_OK:
        log("pymongo no disponible — usando datos de ejemplo", "WARN")
        import json
        DATA = os.path.join(BASE_DIR, "data")
        with open(os.path.join(DATA, "personas.json"))  as f: p = json.load(f)
        with open(os.path.join(DATA, "articulos.json")) as f: a = json.load(f)
        with open(os.path.join(DATA, "ventas.json"))    as f: v = json.load(f)
        return p, a, v

    personas  = fetch("localhost", 27018, "personas_db",  "personas")
    articulos = fetch("localhost", 27017, "articulos_db", "articulos")
    ventas    = fetch("localhost", 27019, "ventas_db",    "ventas")

    elapsed = (datetime.now() - t0).total_seconds()
    log(f"Extraccion completada en {elapsed:.2f}s")
    return personas, articulos, ventas

# ════════════════════════════════════════════════════════
# FASE 2 — TRANSFORMACION y validacion
# ════════════════════════════════════════════════════════
def transform(personas_raw, articulos_raw, ventas_raw):
    log("=== FASE TRANSFORMACION ===")
    t0 = datetime.now()
    errores = 0

    # ── personas ─────────────────────────────────────────
    personas_ok = []
    ids_personas = set()
    for doc in personas_raw:
        try:
            # Eliminar _id de MongoDB
            num_doc  = int(doc["numeroDocumento"])          # debe ser entero
            nombre   = str(doc.get("nombre", "")).strip()
            telefono = int(doc.get("telefono", 0))          # solo numérico

            if not nombre:
                raise ValueError("nombre nulo")
            if num_doc in ids_personas:
                raise ValueError(f"numeroDocumento duplicado: {num_doc}")
            if len(str(telefono)) < 7:
                raise ValueError(f"telefono invalido: {telefono}")

            ids_personas.add(num_doc)
            personas_ok.append((num_doc, nombre, telefono))
        except Exception as e:
            log(f"  [TRANSFORM] Persona invalida: {e}", "ERROR")
            errores += 1

    # ── articulos ─────────────────────────────────────────
    articulos_ok = []
    ids_articulos = set()
    for doc in articulos_raw:
        try:
            id_art   = int(doc["idArticulo"])               # entero único PK
            nombre   = str(doc.get("nombreArticulo", "")).strip()
            cantidad = int(doc.get("cantidadArticulo", 0))  # entero positivo

            if not nombre:
                raise ValueError("nombreArticulo nulo")
            if id_art in ids_articulos:
                raise ValueError(f"idArticulo duplicado: {id_art}")
            if cantidad < 0:
                raise ValueError(f"cantidadArticulo negativa: {cantidad}")

            ids_articulos.add(id_art)
            articulos_ok.append((id_art, nombre, cantidad))
        except Exception as e:
            log(f"  [TRANSFORM] Articulo invalido: {e}", "ERROR")
            errores += 1

    # ── ventas ────────────────────────────────────────────
    ventas_ok = []
    for doc in ventas_raw:
        try:
            id_comprador = int(doc["idComprador"])           # FK → personas
            id_articulo  = int(doc["idArticulo"])            # FK → articulos
            cantidad     = int(doc["cantidadProductos"])     # entero positivo

            # Validar FK: deben existir en tablas padre
            if id_comprador not in ids_personas:
                raise ValueError(f"FK invalida idComprador={id_comprador} no existe en personas")
            if id_articulo not in ids_articulos:
                raise ValueError(f"FK invalida idArticulo={id_articulo} no existe en articulos")
            if cantidad <= 0:
                raise ValueError(f"cantidadProductos invalida: {cantidad}")

            ventas_ok.append((id_comprador, id_articulo, cantidad))
        except Exception as e:
            log(f"  [TRANSFORM] Venta invalida: {e}", "ERROR")
            errores += 1

    elapsed = (datetime.now() - t0).total_seconds()
    log(f"Transformacion: {len(personas_ok)} personas, {len(articulos_ok)} articulos, {len(ventas_ok)} ventas")
    log(f"Registros rechazados: {errores} | Tiempo: {elapsed:.2f}s")
    return personas_ok, articulos_ok, ventas_ok

# ════════════════════════════════════════════════════════
# FASE 3 — CARGA en SQLite
# ════════════════════════════════════════════════════════
def load(personas, articulos, ventas):
    log("=== FASE CARGA (SQLite) ===")
    t0   = datetime.now()
    conn = sqlite3.connect(SQLITE_PATH)
    conn.execute("PRAGMA foreign_keys = ON")   # OBLIGATORIO en SQLite para FK
    cur  = conn.cursor()

    # Crear tablas — tablas padre PRIMERO, luego tabla hija
    cur.executescript("""
        DROP TABLE IF EXISTS ventas;
        DROP TABLE IF EXISTS articulos;
        DROP TABLE IF EXISTS personas;

        CREATE TABLE personas (
            numeroDocumento INTEGER PRIMARY KEY,
            nombre          TEXT    NOT NULL,
            telefono        INTEGER NOT NULL
        );

        CREATE TABLE articulos (
            idArticulo      INTEGER PRIMARY KEY,
            nombreArticulo  TEXT    NOT NULL,
            cantidadArticulo INTEGER NOT NULL CHECK(cantidadArticulo >= 0)
        );

        CREATE TABLE ventas (
            idVenta          INTEGER PRIMARY KEY AUTOINCREMENT,
            idComprador      INTEGER NOT NULL
                             REFERENCES personas(numeroDocumento),
            idArticulo       INTEGER NOT NULL
                             REFERENCES articulos(idArticulo),
            cantidadProductos INTEGER NOT NULL CHECK(cantidadProductos > 0)
        );

        CREATE INDEX IF NOT EXISTS idx_ventas_comprador ON ventas(idComprador);
        CREATE INDEX IF NOT EXISTS idx_ventas_articulo  ON ventas(idArticulo);
    """)

    # Insertar en orden correcto: tablas padre primero
    cur.executemany("INSERT INTO personas  VALUES (?,?,?)", personas)
    log(f"  LOAD personas:  {len(personas)} registros")

    cur.executemany("INSERT INTO articulos VALUES (?,?,?)", articulos)
    log(f"  LOAD articulos: {len(articulos)} registros")

    cur.executemany(
        "INSERT INTO ventas(idComprador, idArticulo, cantidadProductos) VALUES (?,?,?)",
        ventas)
    log(f"  LOAD ventas:    {len(ventas)} registros")

    conn.commit()
    conn.close()
    elapsed = (datetime.now() - t0).total_seconds()
    log(f"SQLite guardado en: {SQLITE_PATH} | Tiempo: {elapsed:.2f}s")

# ════════════════════════════════════════════════════════
# VERIFICACION FINAL
# ════════════════════════════════════════════════════════
def verify():
    log("=== VERIFICACION FINAL ===")
    conn = sqlite3.connect(SQLITE_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    for tabla in ["personas", "articulos", "ventas"]:
        n = conn.execute(f"SELECT COUNT(*) FROM {tabla}").fetchone()[0]
        log(f"  {tabla}: {n} registros ✓")
    top = conn.execute("""
        SELECT a.nombreArticulo, SUM(v.cantidadProductos) as total
        FROM ventas v JOIN articulos a ON v.idArticulo = a.idArticulo
        GROUP BY a.idArticulo ORDER BY total DESC LIMIT 3
    """).fetchall()
    log(f"  Top 3 articulos mas vendidos: {[(r[0][:20], r[1]) for r in top]}")
    conn.close()

# ── MAIN ─────────────────────────────────────────────────
if __name__ == "__main__":
    log("=" * 50)
    log("  ETL: MongoDB → almacen.sqlite")
    log("=" * 50)
    try:
        raw_p, raw_a, raw_v = extract()
        personas, articulos, ventas = transform(raw_p, raw_a, raw_v)
        load(personas, articulos, ventas)
        verify()
        log("ETL completado exitosamente ✓")
    except Exception as e:
        log(f"ETL fallido: {e}", "ERROR")
        sys.exit(1)
