# 🍃 Taller: Diseño de Bases de Datos NoSQL – MongoDB

**Materia:** Arquitectura de Datos | **Autor:** Daniel Alejandro Garcia | ID: 863128 | NRC: 85059  
**Profesor:** Alonso Guevara Pérez

---

## ¿Qué hace este proyecto?

Simula un **sistema de ventas de almacén** en MongoDB con tres conceptos clave:

- **Modelo Embebido:** el cliente vive *dentro* del pedido — una sola consulta, sin joins.
- **Modelo Referenciado:** los productos tienen su propia colección; los pedidos solo guardan el `producto_id`.
- **Flexibilidad de esquema:** `$set` agrega campos a documentos individuales sin afectar los demás — imposible en SQL sin alterar toda la tabla.

---

## 🛠️ Requisitos

| Herramienta | Descarga |
|---|---|
| Docker Desktop | https://www.docker.com/products/docker-desktop |
| VS Code | https://code.visualstudio.com/ |
| Extensión **MongoDB for VS Code** | Marketplace de VS Code → buscar "MongoDB" (hoja verde 🍃) |

---

## 📁 Estructura

```
taller-nosql-mongodb/
├── arrancar_nosql.bat              ← Windows: doble clic para iniciar MongoDB
├── arrancar_nosql.sh               ← Mac/Linux
├── docker-compose.yml
├── scripts/
│   ├── 00_reset.js                 ← Limpia la BD para empezar de cero
│   ├── 01_script_taller.js         ← Crea BD, inserta productos y pedidos base
│   ├── 02_consultas_mongodb.js     ← Consultas y updates básicos
│   ├── 03_datos_completos.js       ← Carga masiva: 20 productos, 15 pedidos
│   └── 04_consultas_estilo_mysql.js← 20 consultas con equivalente MySQL comentado
└── README.md
```

---

## 🚀 Ejecución en Windows (con Docker Desktop)

**1.** Abre **Docker Desktop** y espera a que esté en estado *Running*.

**2.** Doble clic en `arrancar_nosql.bat` — verás:
```
[OK] MongoDB disponible en: mongodb://localhost:27017
```

**3.** Abre VS Code → clic en 🍃 → **Connect with Connection String** → escribe:
```
mongodb://localhost:27017
```

**4.** Corre los scripts desde la terminal de VS Code:
```bash
cd taller-nosql-mongodb
docker exec -i taller-nosql mongosh < scripts/03_datos_completos.js
docker exec -i taller-nosql mongosh < scripts/04_consultas_estilo_mysql.js
```

---

## 🚀 Ejecución en GitHub Codespaces (sin instalación local)

**1.** En GitHub → botón verde **Code** → **Codespaces** → **Create codespace on main**

**2.** En la terminal:
```bash
cd taller-nosql-mongodb
docker-compose up -d
```

> ⚠️ **Error común:** si ves `no configuration file provided: not found`, estás en la carpeta incorrecta.  
> Ejecuta `cd taller-nosql-mongodb` primero y luego `docker-compose up -d`.

**3.** Conecta la extensión MongoDB → 🍃 → `mongodb://localhost:27017`

**4.** Carga los datos:
```bash
docker exec -i taller-nosql mongosh < scripts/03_datos_completos.js
docker exec -i taller-nosql mongosh < scripts/04_consultas_estilo_mysql.js
```

> ⚠️ **Error común:** si ves `No such file or directory` al correr los scripts, estás dentro de la carpeta `scripts/`.  
> Sube un nivel con `cd ..` y vuelve a correr el comando.

---

## 💻 Consultas interactivas en la terminal (estilo MySQL)

Abre la consola de MongoDB:
```bash
docker exec -it taller-nosql mongosh
```
Selecciona la base de datos:
```js
use('AlmacenTaller')
```

### Equivalencias MySQL → MongoDB

| **MySQL** | **MongoDB** |
|---|---|
| `SELECT * FROM productos` | `db.productos.find()` |
| `SELECT * FROM pedidos` | `db.pedidos.find()` |
| `SELECT nombre, precio FROM productos` | `db.productos.find({}, { nombre:1, precio:1, _id:0 })` |
| `SELECT * FROM productos WHERE categoria = 'Accesorios'` | `db.productos.find({ categoria: "Accesorios" })` |
| `SELECT * FROM productos WHERE precio > 500` | `db.productos.find({ precio: { $gt: 500 } })` |
| `SELECT * FROM productos WHERE precio BETWEEN 100 AND 500` | `db.productos.find({ precio: { $gte: 100, $lte: 500 } })` |
| `SELECT * FROM productos WHERE nombre LIKE '%Gaming%'` | `db.productos.find({ nombre: { $regex: "Gaming", $options: "i" } })` |
| `SELECT * FROM productos ORDER BY precio DESC` | `db.productos.find().sort({ precio: -1 })` |
| `SELECT * FROM productos LIMIT 5` | `db.productos.find().limit(5)` |
| `SELECT COUNT(*) FROM pedidos` | `db.pedidos.countDocuments()` |
| `SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente'` | `db.pedidos.countDocuments({ estado: "pendiente" })` |
| `SELECT * FROM pedidos WHERE total > 1000 ORDER BY total DESC` | `db.pedidos.find({ total: { $gt: 1000 } }).sort({ total: -1 })` |
| `SELECT SUM(total) FROM pedidos` | `db.pedidos.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }])` |
| `SELECT AVG(total) FROM pedidos` | `db.pedidos.aggregate([{ $group: { _id: null, promedio: { $avg: "$total" } } }])` |
| `SELECT estado, COUNT(*) FROM pedidos GROUP BY estado` | `db.pedidos.aggregate([{ $group: { _id: "$estado", cantidad: { $sum: 1 } } }])` |
| `SELECT * FROM pedidos WHERE cliente_tipo = 'Corporativo'` | `db.pedidos.find({ "cliente.tipo": "Corporativo" })` |

Para **salir** de la consola:
```
exit
```

---

## 🔧 Comandos Docker útiles

```bash
docker ps                    # Ver contenedores corriendo
docker-compose up -d         # Iniciar MongoDB
docker-compose down          # Detener MongoDB
docker logs taller-nosql     # Ver logs
docker-compose restart       # Reiniciar
```

---

## ❓ Solución de problemas

| Error | Solución |
|---|---|
| `no configuration file provided` | Ejecuta `cd taller-nosql-mongodb` antes de `docker-compose up -d` |
| `No such file or directory` al correr scripts | Estás dentro de `scripts/` — ejecuta `cd ..` primero |
| VS Code no conecta | Confirma con `docker ps` que el contenedor está corriendo |
| Error al insertar datos duplicados | Corre primero `00_reset.js` para limpiar la BD |