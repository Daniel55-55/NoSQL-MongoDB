# 🍃 Taller: Diseño de Bases de Datos NoSQL — MongoDB + ETL + SQLite

**Materia:** Arquitectura de Datos | **Autor:** Daniel Alejandro Garcia | **ID:** 863128 | **NRC:** 85059  
**Profesor:** Alonso Guevara Pérez | **GitHub:** github.com/Daniel55-55/NoSQL-MongoDB

---

## Arquitectura del sistema

```
personas.json  ──►  mongodb_personas  (puerto 27018)  ─┐
articulos.json ──►  mongodb_articulos (puerto 27017)  ─┤──► ETL ──► almacen.sqlite ──► Jupyter
ventas.json    ──►  mongodb_ventas    (puerto 27019)  ─┘
```

| Contenedor | Puerto externo | Puerto interno | Base de datos |
|---|---|---|---|
| `mongodb_personas` | 27018 | 27017 | `personas_db.personas` |
| `mongodb_articulos` | 27017 | 27017 | `articulos_db.articulos` |
| `mongodb_ventas` | 27019 | 27017 | `ventas_db.ventas` |

---

## Esquema de bases de datos

### MongoDB (colecciones — modelo NoSQL)

**personas_db.personas**
```json
{ "numeroDocumento": 1001, "nombre": "Juan Perez", "telefono": 3001234567 }
```

**articulos_db.articulos**
```json
{ "idArticulo": 1, "nombreArticulo": "Laptop Gamer", "cantidadArticulo": 8 }
```

**ventas_db.ventas**
```json
{ "idComprador": 1001, "idArticulo": 1, "cantidadProductos": 2 }
```

### SQLite — almacen.sqlite (tablas relacionales con FK)

```sql
CREATE TABLE personas (
    numeroDocumento INTEGER PRIMARY KEY,
    nombre          TEXT    NOT NULL,
    telefono        INTEGER NOT NULL
);

CREATE TABLE articulos (
    idArticulo       INTEGER PRIMARY KEY,
    nombreArticulo   TEXT    NOT NULL,
    cantidadArticulo INTEGER NOT NULL
);

CREATE TABLE ventas (
    idVenta           INTEGER PRIMARY KEY AUTOINCREMENT,
    idComprador       INTEGER NOT NULL REFERENCES personas(numeroDocumento),
    idArticulo        INTEGER NOT NULL REFERENCES articulos(idArticulo),
    cantidadProductos INTEGER NOT NULL
);
```

> `PRAGMA foreign_keys = ON` — activa las FK en SQLite (obligatorio).  
> Orden de inserción: **personas** y **articulos** primero (tablas padre), luego **ventas** (tabla hija).

---

## 📁 Estructura del proyecto

```
taller-nosql-mongodb/
├── arrancar_nosql.bat              ← Windows: doble clic — inicia TODO
├── arrancar_nosql.sh               ← Mac/Linux
├── docker-compose.yml              ← 3 contenedores MongoDB
├── data/
│   ├── personas.json               ← Datos fuente
│   ├── articulos.json
│   ├── ventas.json
│   ├── almacen.sqlite              ← Generado por el ETL
│   └── debug.log                   ← Log del ETL (errores, tiempos)
├── scripts/
│   ├── 01_cargar_json_mongo.py     ← Carga JSON en las 3 MongoDB
│   ├── 02_etl_mongo_sqlite.py      ← ETL: MongoDB → SQLite
│   └── 03_consultas_sqlite.py      ← Consultas SQL sobre SQLite
├── notebooks/
│   └── proyectoBDM.ipynb           ← Análisis y visualizaciones
└── README.md
```

---

## 🚀 Ejecución en Windows — Todo desde el .bat

> **Requisitos:** Docker Desktop instalado y corriendo + Python 3 instalado

**Doble clic en `arrancar_nosql.bat`** — hace todo automáticamente:

1. Verifica que Docker esté corriendo
2. Levanta los **3 contenedores MongoDB** con `docker-compose up -d`
3. Espera 6 segundos para que MongoDB inicie
4. Instala `pymongo` si no está disponible
5. Ejecuta `01_cargar_json_mongo.py` → carga los JSON en cada MongoDB
6. Ejecuta `02_etl_mongo_sqlite.py` → genera `data/almacen.sqlite`
7. Abre **VS Code** en la carpeta del proyecto

---

## 🚀 Ejecución en GitHub Codespaces

**1.** En GitHub → botón **Code** → **Codespaces** → **Create codespace on main**

**2.** En la terminal, entra a la carpeta correcta:
```bash
cd taller-nosql-mongodb
```
> ⚠️ Error común: `no configuration file provided` → estás en la carpeta incorrecta. Ejecuta `cd taller-nosql-mongodb` primero.

**3.** Levanta los 3 contenedores MongoDB:
```bash
docker-compose up -d
```
Verifica que estén corriendo:
```bash
docker ps
```
Debes ver: `mongodb_personas`, `mongodb_articulos`, `mongodb_ventas`

**4.** Instala pymongo:
```bash
pip install pymongo --break-system-packages
```

**5.** Carga los JSON en MongoDB:
```bash
python scripts/01_cargar_json_mongo.py
```

**6.** Ejecuta el ETL (MongoDB → SQLite):
```bash
python scripts/02_etl_mongo_sqlite.py
```
> ⚠️ Error común: `No such file or directory` al correr scripts → estás dentro de `scripts/`. Ejecuta `cd ..` primero.

**7.** Ejecuta las consultas SQLite:
```bash
python scripts/03_consultas_sqlite.py
```

**8.** Abre el notebook de análisis:
```bash
pip install jupyter matplotlib pandas --break-system-packages
jupyter notebook notebooks/proyectoBDM.ipynb
```

---

## 💻 Consultas interactivas en MongoDB

Abre la consola de cualquier MongoDB:
```bash
# personas
docker exec -it mongodb_personas mongosh
use personas_db
db.personas.find()

# articulos
docker exec -it mongodb_articulos mongosh
use articulos_db
db.articulos.find()

# ventas
docker exec -it mongodb_ventas mongosh
use ventas_db
db.ventas.find()
```

---

## 💻 Consultas SQLite equivalentes a MySQL

Conectar directamente:
```python
import sqlite3
conn = sqlite3.connect('data/almacen.sqlite')
conn.execute('PRAGMA foreign_keys = ON')
```

| MySQL | SQLite (almacen.sqlite) |
|---|---|
| `SELECT * FROM personas` | `conn.execute("SELECT * FROM personas").fetchall()` |
| `SELECT * FROM articulos` | `conn.execute("SELECT * FROM articulos").fetchall()` |
| `SELECT * FROM ventas` | `conn.execute("SELECT * FROM ventas").fetchall()` |
| `WHERE campo = valor` | `WHERE campo = valor` ← igual |
| `WHERE precio BETWEEN 1 AND 5` | `WHERE cantidadProductos BETWEEN 1 AND 5` |
| `WHERE nombre LIKE '%Laptop%'` | `WHERE nombreArticulo LIKE '%Laptop%'` |
| `ORDER BY campo DESC` | `ORDER BY campo DESC` ← igual |
| `LIMIT 5` | `LIMIT 5` ← igual |
| `COUNT(*)` | `COUNT(*)` ← igual |
| `SUM(campo)` | `SUM(cantidadProductos)` |
| `AVG(campo)` | `AVG(cantidadProductos)` |
| `GROUP BY campo` | `GROUP BY campo` ← igual |

**Top 5 artículos más vendidos:**
```sql
SELECT a.nombreArticulo, SUM(v.cantidadProductos) AS total_vendido
FROM ventas v
JOIN articulos a ON v.idArticulo = a.idArticulo
GROUP BY v.idArticulo, a.nombreArticulo
ORDER BY total_vendido DESC
LIMIT 5
```

**Top 5 artículos MENOS vendidos (LEFT JOIN + COALESCE):**
```sql
SELECT a.nombreArticulo,
       COALESCE(SUM(v.cantidadProductos), 0) AS total_vendido
FROM articulos a
LEFT JOIN ventas v ON a.idArticulo = v.idArticulo
GROUP BY a.idArticulo
ORDER BY total_vendido ASC
LIMIT 5
```

**Top 5 compradores:**
```sql
SELECT p.nombre,
       COUNT(v.idVenta)         AS num_compras,
       SUM(v.cantidadProductos) AS total_productos
FROM personas p
JOIN ventas v ON p.numeroDocumento = v.idComprador
GROUP BY p.numeroDocumento, p.nombre
ORDER BY num_compras DESC
LIMIT 5
```

---

## 📊 ETL — Proceso completo

El script `02_etl_mongo_sqlite.py` implementa las 3 fases:

**EXTRACCIÓN** — lee de las 3 MongoDB distribuidas:
- `GET personas_db.personas` desde `localhost:27018`
- `GET articulos_db.articulos` desde `localhost:27017`
- `GET ventas_db.ventas` desde `localhost:27019`

**TRANSFORMACIÓN** — valida y limpia cada registro:
- Elimina el `_id` generado por MongoDB
- Valida que `numeroDocumento` y `telefono` sean numéricos
- Valida que `idArticulo` sea entero único (PK)
- Valida que `cantidadArticulo` sea entero positivo
- Verifica FK: `idComprador` debe existir en personas, `idArticulo` en articulos
- Registra errores en `data/debug.log` y continúa con los registros válidos

**CARGA** — inserta en SQLite en orden correcto:
1. `personas` (tabla padre)
2. `articulos` (tabla padre)
3. `ventas` (tabla hija — tiene FK a las dos anteriores)

---

## 🔧 Comandos Docker útiles

```bash
docker ps                        # Ver los 3 contenedores corriendo
docker-compose up -d             # Iniciar todos
docker-compose down              # Detener todos
docker logs mongodb_personas     # Ver logs de un contenedor
docker-compose restart           # Reiniciar todos
```

---

## ❓ Solución de problemas

| Error | Solución |
|---|---|
| `no configuration file provided` | Ejecuta `cd taller-nosql-mongodb` antes de `docker-compose up -d` |
| `No such file or directory` al correr scripts | Estás dentro de `scripts/` — ejecuta `cd ..` primero |
| `Connection refused` en el ETL | Verifica con `docker ps` que los 3 contenedores estén corriendo |
| `ModuleNotFoundError: pymongo` | Ejecuta `pip install pymongo --break-system-packages` |
| Error al insertar datos duplicados | El ETL hace `drop()` antes de insertar — es normal en la primera ejecución |
| `almacen.sqlite not found` | Ejecuta primero `python scripts/02_etl_mongo_sqlite.py` |
