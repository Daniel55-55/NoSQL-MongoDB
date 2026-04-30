"""
============================================================
PASO 1 — Cargar JSON en las 3 bases MongoDB distribuidas
  personas.json  → mongodb_personas:27018  → personas_db.personas
  articulos.json → mongodb_articulos:27017 → articulos_db.articulos
  ventas.json    → mongodb_ventas:27019    → ventas_db.ventas
============================================================
Uso: python scripts/01_cargar_json_mongo.py
"""

import json, os, sys
from datetime import datetime

try:
    from pymongo import MongoClient
except ImportError:
    print("[ERROR] Instala pymongo: pip install pymongo")
    sys.exit(1)

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR  = os.path.join(BASE_DIR, "data")
LOG_PATH  = os.path.join(DATA_DIR, "debug.log")

def log(msg, level="INFO"):
    ts   = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] [{level}] {msg}"
    print(line)
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def cargar_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def cargar_coleccion(host, port, db_name, col_name, docs):
    """Conecta a MongoDB, limpia la colección e inserta los documentos."""
    try:
        client = MongoClient(host=host, port=port, serverSelectionTimeoutMS=4000)
        client.server_info()  # dispara error si no conecta
        db  = client[db_name]
        col = db[col_name]
        col.drop()            # limpiar antes de insertar
        result = col.insert_many(docs)
        log(f"  {host}:{port}/{db_name}.{col_name} → {len(result.inserted_ids)} documentos insertados")
        client.close()
        return len(result.inserted_ids)
    except Exception as e:
        log(f"  Error en {host}:{port} → {e}", "ERROR")
        return 0

# ── MAIN ─────────────────────────────────────────────────
log("=== EXTRACCION: Cargando JSON en MongoDB distribuido ===")
t0 = datetime.now()

personas  = cargar_json(os.path.join(DATA_DIR, "personas.json"))
articulos = cargar_json(os.path.join(DATA_DIR, "articulos.json"))
ventas    = cargar_json(os.path.join(DATA_DIR, "ventas.json"))

log(f"JSON leidos: {len(personas)} personas, {len(articulos)} articulos, {len(ventas)} ventas")

n1 = cargar_coleccion("localhost", 27018, "personas_db",  "personas",  personas)
n2 = cargar_coleccion("localhost", 27017, "articulos_db", "articulos", articulos)
n3 = cargar_coleccion("localhost", 27019, "ventas_db",    "ventas",    ventas)

elapsed = (datetime.now() - t0).total_seconds()
log(f"Carga completada en {elapsed:.2f}s — personas:{n1}, articulos:{n2}, ventas:{n3}")
log(f"Verificar con: GET /mongo/personas | /mongo/articulos | /mongo/ventas")
