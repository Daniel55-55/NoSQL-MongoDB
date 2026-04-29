# 🍃 Taller: Diseño de Bases de Datos NoSQL – MongoDB

**Materia:** Arquitectura de Datos  
**Autor:** Daniel Alejandro Garcia | ID: 863128 | NRC: 85059  
**Profesor:** Alonso Guevara Pérez

---

## 📋 ¿De qué trata este proyecto?

Taller práctico que simula un **sistema de ventas de un almacén** usando MongoDB como base de datos NoSQL. El proyecto demuestra tres conceptos clave:

**Modelo Embebido:** el cliente se guarda *dentro* del documento del pedido. Como los datos del cliente no cambian frecuentemente, embeberlos permite leer todo en una sola consulta, sin joins.

**Modelo Referenciado:** los productos viven en su propia colección. Los pedidos solo guardan el `producto_id`. Así, si el precio cambia, se actualiza en un solo lugar sin duplicar información.

**Flexibilidad de esquema:** con `$set` se agregan campos nuevos (`garantia_extendida`, `observaciones`) a un solo documento sin afectar el resto de la colección — algo imposible de hacer limpiamente en SQL sin alterar toda la tabla.

---

## 🛠️ Requisitos previos

| Herramienta | Para qué sirve | Descarga |
|---|---|---|
| Docker Desktop | Ejecuta MongoDB sin instalarlo | https://www.docker.com/products/docker-desktop |
| VS Code | Editor de código | https://code.visualstudio.com/ |
| Extensión MongoDB for VS Code | Visualizar y ejecutar scripts | Marketplace de VS Code → buscar "MongoDB" |

> **No necesitas instalar MongoDB.** Docker lo ejecuta en un contenedor aislado.

---

## 📁 Estructura del proyecto

```
taller-nosql-mongodb/
├── arrancar_nosql.bat           ← Inicia MongoDB en Windows (doble clic)
├── arrancar_nosql.sh            ← Inicia MongoDB en Mac/Linux
├── docker-compose.yml           ← Configuración del contenedor MongoDB 7
├── scripts/
│   ├── 00_reset.js              ← Limpia la BD para volver a empezar
│   ├── 01_script_taller.js      ← Crea la BD, inserta productos y pedidos
│   └── 02_consultas_mongodb.js  ← Consultas, updates y demostración de flexibilidad
└── README.md
```

---

## 🚀 Paso a paso — Ejecución local (PC con Docker Desktop)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Daniel55-55/NoSQL-MongoDB.git
cd NoSQL-MongoDB/taller-nosql-mongodb
```

### 2. Abrir Docker Desktop
Espera a que el ícono en la barra de tareas quede estático (estado: Running).

### 3. Levantar MongoDB

**Windows:** doble clic en `arrancar_nosql.bat`

**Mac / Linux:**
```bash
chmod +x arrancar_nosql.sh
./arrancar_nosql.sh
```

Verás:
```
[OK] MongoDB disponible en: mongodb://localhost:27017
```

### 4. Conectar VS Code a MongoDB
1. Clic en el ícono 🍃 en la barra lateral izquierda
2. Clic en **Add Connection** → **Connect with Connection String**
3. Escribe: `mongodb://localhost:27017`
4. Presiona Enter — aparecerá el punto verde ✅

### 5. Ejecutar los scripts en orden

Abre cada archivo en VS Code y presiona **Ctrl + Shift + P** → `MongoDB: Run All From Playground`:

| Orden | Archivo | Qué hace |
|---|---|---|
| 1️⃣ | `scripts/01_script_taller.js` | Crea `AlmacenTaller`, inserta productos y pedidos |
| 2️⃣ | `scripts/02_consultas_mongodb.js` | Ejecuta consultas y demuestra la flexibilidad |
| 🔄 | `scripts/00_reset.js` | Limpia todo para empezar de cero |

---

## 🚀 Ejecución en GitHub Codespaces (sin Docker local)

Si no tienes Docker Desktop instalado, puedes usar **GitHub Codespaces** directamente desde el navegador:

### 1. Abrir Codespaces
En GitHub → botón verde **Code** → **Codespaces** → **Create codespace on main**

### 2. En la terminal del Codespace, entra a la carpeta correcta:
```bash
cd taller-nosql-mongodb
```

### 3. Levanta MongoDB:
```bash
docker-compose up -d
```
Verás: `✓ Container taller-nosql   Started`

### 4. Conecta la extensión MongoDB
- Clic en 🍃 → **Connect** → `mongodb://localhost:27017`

### 5. Corre los scripts desde la terminal:
```bash
# Script 1 — Insertar datos
docker exec -it taller-nosql mongosh --eval "
  use('AlmacenTaller');
  db.productos.insertMany([
    {_id:'PROD01', nombre:'Laptop Gamer', precio:1500, stock:10, categoria:'Tecnologia'},
    {_id:'PROD02', nombre:'Mouse Inalambrico', precio:45, stock:50, categoria:'Accesorios'},
    {_id:'PROD03', nombre:'Teclado Mecanico', precio:120, stock:25, categoria:'Accesorios'}
  ]);
  db.pedidos.insertOne({
    nro_factura:1001,
    cliente:{nombre:'Juan Perez', tipo:'Premium', ciudad:'Bogota'},
    items:[{producto_id:'PROD01', cantidad:1, subtotal:1500}],
    total:1500, estado:'entregado'
  });
  print('Datos insertados OK');
"
```

```bash
# Verificar datos insertados
docker exec -it taller-nosql mongosh --eval "
  use('AlmacenTaller');
  print('=== PRODUCTOS ===');
  db.productos.find().forEach(p => printjson(p));
  print('=== PEDIDOS ===');
  db.pedidos.find().forEach(p => printjson(p));
"
```

---

## 🗂️ Modelo de datos

### Colección `productos` — Modelo Referenciado
```json
{
  "_id": "PROD01",
  "nombre": "Laptop Gamer",
  "descripcion": "Laptop de alto rendimiento para gaming",
  "precio": 1500,
  "stock": 10,
  "categoria": "Tecnologia"
}
```

### Colección `pedidos` — Modelo Híbrido
```json
{
  "nro_factura": 1001,
  "fecha": "2025-04-01",
  "estado": "entregado",
  "cliente": {
    "nombre": "Juan Perez",
    "tipo": "Premium",
    "ciudad": "Bogota"
  },
  "items": [
    { "producto_id": "PROD01", "cantidad": 1, "subtotal": 1500 }
  ],
  "total": 1500
}
```

> **Embebido:** `cliente` vive dentro del pedido — consulta más rápida, sin joins.  
> **Referenciado:** `items` usa `producto_id` — evita duplicar datos del producto.

---

## 💡 Conceptos demostrados

**Modelo embebido:** datos anidados en el mismo documento. Consulta más rápida, menos operaciones. Ideal para datos estáticos.

**Modelo referenciado:** separación de datos mediante IDs. Evita duplicación y facilita actualizaciones centralizadas. Ideal para datos dinámicos.

**Flexibilidad de esquema:** `$set` agrega campos a documentos individuales sin afectar el resto. Documentos heterogéneos sin alteración global — gran ventaja sobre SQL.

---

## 🔧 Comandos útiles de Docker

```bash
# Ver contenedores corriendo
docker ps

# Detener MongoDB
docker-compose down

# Ver logs de MongoDB
docker logs taller-nosql

# Reiniciar el contenedor
docker-compose restart
```

---

## ❓ Solución de problemas

**`no configuration file provided`:** Asegúrate de estar dentro de la carpeta `taller-nosql-mongodb/` antes de correr `docker-compose up -d`.

**El contenedor no inicia:** Verifica que Docker Desktop esté abierto. Revisa que el puerto 27017 no esté en uso con `docker ps`.

**VS Code no conecta:** Confirma que el contenedor está corriendo con `docker ps`. Usa exactamente `mongodb://localhost:27017`.

**Error al ejecutar el script:** Si ya existían datos previos, corre primero `00_reset.js` para limpiar la BD.