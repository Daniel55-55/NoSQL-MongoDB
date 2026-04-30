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

| Contenedor | Puerto externo | Base de datos |
|---|---|---|
| `mongodb_personas` | 27018 | `personas_db.personas` |
| `mongodb_articulos` | 27017 | `articulos_db.articulos` |
| `mongodb_ventas` | 27019 | `ventas_db.ventas` |

---

## 📁 Estructura del proyecto

```
project/
├── arrancar_nosql.bat              ← Windows: doble clic — inicia TODO
├── arrancar_nosql.sh               ← Mac/Linux
├── docker-compose.yml              ← 3 contenedores MongoDB
├── data/
│   ├── personas.json               ← Datos fuente
│   ├── articulos.json
│   ├── ventas.json
│   ├── almacen.sqlite              ← Generado por el ETL
│   └── debug.log                   ← Log del ETL
├── scripts/
│   ├── 01_cargar_json_mongo.py     ← Carga JSON en las 3 MongoDB
│   ├── 02_etl_mongo_sqlite.py      ← ETL: MongoDB → SQLite
│   └── 03_consultas_sqlite.py      ← Consultas SQL sobre SQLite
├── notebooks/
│   └── proyectoBDM.ipynb           ← Análisis y visualizaciones
└── README.md
```

---

## 🚀 Ejecución paso a paso — GitHub Codespaces

### Paso 1 — Abrir el Codespace

En GitHub → botón verde **Code** → **Codespaces** → **Create codespace on main**

---

### Paso 2 — Entrar a la carpeta del proyecto

```bash
cd project
```

> ⚠️ Si ves `no configuration file provided` es porque no entraste a esta carpeta.

---

### Paso 3 — Levantar los 3 contenedores MongoDB

```bash
docker compose up -d
```

Verificar que estén corriendo:

```bash
docker ps
```

Debes ver los 3 contenedores activos:
```
mongodb_personas    Running
mongodb_articulos   Running
mongodb_ventas      Running
```

---

### Paso 4 — Instalar pymongo

```bash
pip install pymongo --break-system-packages
```

---

### Paso 5 — Cargar los JSON en MongoDB

```bash
python scripts/01_cargar_json_mongo.py
```

Resultado esperado:
```
localhost:27018/personas_db.personas   → 10 documentos insertados
localhost:27017/articulos_db.articulos → 10 documentos insertados
localhost:27019/ventas_db.ventas       → 20 documentos insertados
```

---

### Paso 6 — Ejecutar el ETL (MongoDB → SQLite)

```bash
python scripts/02_etl_mongo_sqlite.py
```

Resultado esperado:
```
=== FASE EXTRACCION ===
=== FASE TRANSFORMACION ===
Transformacion: 10 personas, 10 articulos, 20 ventas
Registros rechazados: 0
=== FASE CARGA (SQLite) ===
  LOAD personas:  10 registros
  LOAD articulos: 10 registros
  LOAD ventas:    20 registros
=== VERIFICACION FINAL ===
  personas:  10 registros ✓
  articulos: 10 registros ✓
  ventas:    20 registros ✓
ETL completado exitosamente ✓
```

> ⚠️ Si ves `No such file or directory` estás dentro de `scripts/`. Ejecuta `cd ..` primero.

---

### Paso 7 — Ejecutar consultas SQLite

```bash
python scripts/03_consultas_sqlite.py
```

---

### Paso 8 — Ver datos en MongoDB (opcional)

```bash
# Ver personas
docker exec -it mongodb_personas mongosh --eval "use('personas_db'); db.personas.find().forEach(printjson)"

# Ver articulos
docker exec -it mongodb_articulos mongosh --eval "use('articulos_db'); db.articulos.find().forEach(printjson)"

# Ver ventas
docker exec -it mongodb_ventas mongosh --eval "use('ventas_db'); db.ventas.find().forEach(printjson)"
```

---

### Paso 9 — Abrir el Notebook con gráficas

```bash
pip install jupyter matplotlib pandas --break-system-packages
cp notebooks/.ipynb_checkpoints/proyectoBDM-checkpoint.ipynb notebooks/proyectoBDM.ipynb
jupyter notebook notebooks/proyectoBDM.ipynb
```

Copia el token que aparece en la terminal y pégalo en el navegador. El notebook abre directo con las gráficas listas para ejecutar.

Clic en **Ejecutar todo** ▶▶ — genera 4 visualizaciones:
1. Vista de las 3 tablas (personas, articulos, ventas)
2. Top 5 artículos más vendidos — barras verticales
3. Top 5 artículos menos vendidos — barras horizontales (LEFT JOIN + COALESCE)
4. Top 5 compradores con más compras
5. Histograma de distribución de ventas

---

## 🚀 Ejecución en Windows — Todo desde el .bat

**Requisitos:** Docker Desktop abierto + Python 3 instalado

**Doble clic en `arrancar_nosql.bat`** — hace todo automáticamente:

1. Verifica que Docker esté corriendo
2. Levanta los 3 contenedores MongoDB
3. Espera 6 segundos
4. Instala pymongo si no está
5. Carga los JSON en MongoDB
6. Ejecuta el ETL → genera `data/almacen.sqlite`
7. Abre VS Code

> ⚠️ Si sale error `docker-compose no reconocido` usa el comando manual: `docker compose up -d` (sin guion). Las versiones nuevas de Docker Desktop usan `docker compose` en lugar de `docker-compose`.

---

## 📊 ETL — 3 fases

**EXTRACCIÓN** — lee de las 3 MongoDB:
- `personas_db.personas` desde `localhost:27018`
- `articulos_db.articulos` desde `localhost:27017`
- `ventas_db.ventas` desde `localhost:27019`

**TRANSFORMACIÓN** — valida y limpia:
- Elimina el `_id` generado por MongoDB
- Valida que `numeroDocumento` y `telefono` sean numéricos
- Valida que `idArticulo` sea entero único (PK)
- Valida que `cantidadArticulo` sea entero positivo
- Verifica FK: `idComprador` debe existir en personas, `idArticulo` en articulos
- Registra errores en `data/debug.log` y continúa con los válidos

**CARGA** — inserta en SQLite en orden correcto:
1. `personas` — tabla padre
2. `articulos` — tabla padre
3. `ventas` — tabla hija (tiene FK a las dos anteriores)

---

## 🗂️ Esquema SQLite — almacen.sqlite

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

`PRAGMA foreign_keys = ON` — activa las FK en SQLite (obligatorio).

---

## 💻 Consultas clave sobre SQLite

**Top 5 artículos más vendidos:**
```sql
SELECT a.nombreArticulo, SUM(v.cantidadProductos) AS total_vendido
FROM ventas v
JOIN articulos a ON v.idArticulo = a.idArticulo
GROUP BY v.idArticulo, a.nombreArticulo
ORDER BY total_vendido DESC
LIMIT 5
```

**Top 5 artículos menos vendidos — LEFT JOIN + COALESCE:**
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

## 🔧 Comandos Docker útiles

```bash
docker ps                          # Ver los 3 contenedores
docker compose up -d               # Iniciar todos
docker compose down                # Detener todos
docker logs mongodb_personas       # Ver logs
docker compose restart             # Reiniciar
```

---

## ❓ Solución de problemas

| Error | Solución |
|---|---|
| `no configuration file provided` | Ejecuta `cd project` antes de `docker compose up -d` |
| `docker-compose no reconocido` | Usa `docker compose` (sin guion) — versiones nuevas de Docker |
| `No such file or directory` al correr scripts | Estás en `scripts/` — ejecuta `cd ..` primero |
| `Connection refused` en el ETL | Verifica con `docker ps` que los 3 contenedores estén corriendo |
| `ModuleNotFoundError: pymongo` | `pip install pymongo --break-system-packages` |
| Jupyter muestra carpeta vacía | El notebook está en `.ipynb_checkpoints/` — ejecuta el paso 9 completo |
| `almacen.sqlite not found` en notebook | Ejecuta primero el paso 6 (`02_etl_mongo_sqlite.py`) |
