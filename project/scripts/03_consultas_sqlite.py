"""
============================================================
PASO 3 — Consultas SQLite sobre almacen.sqlite
Ejecutar DESPUÉS de 02_etl_mongo_sqlite.py
============================================================
Uso: python scripts/03_consultas_sqlite.py
"""

import sqlite3, os
from datetime import datetime

BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQLITE_PATH = os.path.join(BASE_DIR, "data", "almacen.sqlite")

if not os.path.exists(SQLITE_PATH):
    print("[ERROR] No existe almacen.sqlite")
    print("        Ejecuta primero: python scripts/02_etl_mongo_sqlite.py")
    exit(1)

conn = sqlite3.connect(SQLITE_PATH)
conn.execute("PRAGMA foreign_keys = ON")
conn.row_factory = sqlite3.Row

def q(titulo, sql):
    print(f"\n{'='*60}")
    print(f"  {titulo}")
    print(f"{'='*60}")
    rows = conn.execute(sql).fetchall()
    if not rows:
        print("  (sin resultados)")
    for r in rows:
        print(" ", dict(r))
    return rows

print("\n🍃 Consultas SQLite — almacen.sqlite\n")

# ── BÁSICAS ──────────────────────────────────────────────
q("SELECT * FROM personas",
  "SELECT * FROM personas")

q("SELECT * FROM articulos",
  "SELECT * FROM articulos")

q("SELECT * FROM ventas",
  "SELECT * FROM ventas")

# ── WHERE ────────────────────────────────────────────────
q("Personas con telefono que empieza en 300",
  "SELECT * FROM personas WHERE CAST(telefono AS TEXT) LIKE '300%'")

q("Articulos con cantidadArticulo > 20",
  "SELECT * FROM articulos WHERE cantidadArticulo > 20")

q("Articulos con cantidadArticulo BETWEEN 15 AND 30",
  "SELECT * FROM articulos WHERE cantidadArticulo BETWEEN 15 AND 30")

q("Articulos con nombre LIKE '%Laptop%'",
  "SELECT * FROM articulos WHERE nombreArticulo LIKE '%Laptop%'")

# ── ORDER BY / LIMIT ─────────────────────────────────────
q("Articulos ORDER BY cantidadArticulo DESC",
  "SELECT * FROM articulos ORDER BY cantidadArticulo DESC")

q("Top 5 articulos con más stock",
  "SELECT * FROM articulos ORDER BY cantidadArticulo DESC LIMIT 5")

# ── COUNT / SUM / AVG ────────────────────────────────────
q("COUNT(*) FROM personas",
  "SELECT COUNT(*) AS total_personas FROM personas")

q("COUNT(*) FROM ventas",
  "SELECT COUNT(*) AS total_ventas FROM ventas")

q("SUM cantidadProductos FROM ventas",
  "SELECT SUM(cantidadProductos) AS total_productos_vendidos FROM ventas")

q("AVG cantidadProductos FROM ventas",
  "SELECT ROUND(AVG(cantidadProductos), 2) AS promedio FROM ventas")

# ── GROUP BY ─────────────────────────────────────────────
q("Ventas agrupadas por idComprador",
  """SELECT idComprador, COUNT(*) AS num_compras,
            SUM(cantidadProductos) AS total_productos
     FROM ventas
     GROUP BY idComprador
     ORDER BY total_productos DESC""")

q("Ventas agrupadas por idArticulo",
  """SELECT idArticulo, SUM(cantidadProductos) AS total_vendido
     FROM ventas
     GROUP BY idArticulo
     ORDER BY total_vendido DESC""")

# ── JOINS ────────────────────────────────────────────────
q("TOP 5 compradores con más compras (JOIN personas + ventas)",
  """SELECT p.nombre,
            COUNT(v.idVenta)          AS num_compras,
            SUM(v.cantidadProductos)  AS total_productos
     FROM personas p
     JOIN ventas v ON p.numeroDocumento = v.idComprador
     GROUP BY p.numeroDocumento, p.nombre
     ORDER BY num_compras DESC
     LIMIT 5""")

q("TOP 5 articulos MAS vendidos (JOIN articulos + ventas)",
  """SELECT a.nombreArticulo,
            SUM(v.cantidadProductos) AS total_vendido
     FROM ventas v
     JOIN articulos a ON v.idArticulo = a.idArticulo
     GROUP BY v.idArticulo, a.nombreArticulo
     ORDER BY total_vendido DESC
     LIMIT 5""")

q("TOP 5 articulos MENOS vendidos (LEFT JOIN + COALESCE)",
  """SELECT a.nombreArticulo,
            COALESCE(SUM(v.cantidadProductos), 0) AS total_vendido
     FROM articulos a
     LEFT JOIN ventas v ON a.idArticulo = v.idArticulo
     GROUP BY a.idArticulo
     ORDER BY total_vendido ASC
     LIMIT 5""")

q("Histograma: distribucion de ventas por cantidad",
  """SELECT cantidadProductos AS cantidad,
            COUNT(*) AS frecuencia
     FROM ventas
     GROUP BY cantidadProductos
     ORDER BY cantidadProductos""")

q("EXPLAIN QUERY PLAN — analisis de query con JOIN",
  """EXPLAIN QUERY PLAN
     SELECT p.nombre, SUM(v.cantidadProductos)
     FROM personas p JOIN ventas v ON p.numeroDocumento = v.idComprador
     GROUP BY p.numeroDocumento""")

conn.close()
print("\n✅ Todas las consultas ejecutadas.\n")
