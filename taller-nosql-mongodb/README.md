# 🍃 Taller: Diseño de Bases de Datos NoSQL – MongoDB

**Materia:** Arquitectura de Datos  
**Autor:** Daniel Alejandro Garcia | ID: 863128 | NRC: 85059  
**Profesor:** Alonso Guevara Pérez

---

## 📋 Descripción

Taller práctico que simula un sistema de ventas para un almacén usando MongoDB como base de datos NoSQL. Se implementan los modelos de datos **embebido** y **referenciado**, y se evidencia la flexibilidad de los documentos sin estructura fija.

---

## 🛠️ Requisitos previos

Antes de clonar o descomprimir el proyecto, asegúrate de tener instalado:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Docker Desktop | Cualquier versión reciente | https://www.docker.com/products/docker-desktop |
| VS Code | Cualquier versión reciente | https://code.visualstudio.com/ |
| Extensión MongoDB for VS Code | — | Buscar en el marketplace de VS Code |

> **No necesitas instalar MongoDB** directamente. Docker lo ejecuta en un contenedor aislado.

---

## 📁 Estructura del proyecto

```
taller-nosql-mongodb/
├── arrancar_nosql.bat       ← Inicia MongoDB en Windows (doble clic)
├── arrancar_nosql.sh        ← Inicia MongoDB en Mac/Linux
├── docker-compose.yml       ← Configuración del contenedor MongoDB
├── scripts/
│   ├── 00_reset.js          ← Limpia la BD para empezar de cero
│   ├── 01_script_taller.js  ← Crea la BD e inserta documentos
│   └── 02_consultas_mongodb.js ← Consultas y modificaciones
└── README.md
```

---

## 🚀 Paso a paso para ejecutar el taller

### 1. Clonar o descomprimir el proyecto

**Opción A – Desde GitHub:**
```bash
git clone https://github.com/TU_USUARIO/taller-nosql-mongodb.git
cd taller-nosql-mongodb
```

**Opción B – Desde el .zip:**
Descomprime el archivo y abre la carpeta en VS Code.

---

### 2. Iniciar Docker Desktop

Abre **Docker Desktop** y espera a que el ícono en la barra de tareas deje de girar (estado: Running).

---

### 3. Levantar MongoDB

**Windows:** Haz doble clic en `arrancar_nosql.bat`  
*(Si pide permisos de administrador, acéptalos)*

**Mac / Linux:**
```bash
chmod +x arrancar_nosql.sh
./arrancar_nosql.sh
```

Verás el mensaje:
```
[OK] MongoDB disponible en: mongodb://localhost:27017
```

---

### 4. Conectar VS Code a MongoDB

1. Abre VS Code
2. En la barra lateral izquierda, haz clic en el ícono de hoja de MongoDB 🍃
3. Haz clic en **"Add Connection"** o **"Connect"**
4. Ingresa la cadena de conexión:
   ```
   mongodb://localhost:27017
   ```
5. Haz clic en **Connect**
6. Deberías ver el servidor conectado y la opción de explorar bases de datos

---

### 5. Ejecutar los scripts en orden

Abre cada archivo en VS Code y usa el botón **"Run"** (▶) que aparece en la esquina superior derecha del editor MongoDB, o usa **"Run All"**:

| Orden | Archivo | Qué hace |
|---|---|---|
| 1️⃣ | `scripts/01_script_taller.js` | Crea la BD `AlmacenTaller`, inserta productos y pedidos |
| 2️⃣ | `scripts/02_consultas_mongodb.js` | Ejecuta consultas, actualizaciones y demuestra la flexibilidad |
| 🔄 | `scripts/00_reset.js` | Limpia todo para volver a empezar |

---

## 🗂️ Modelo de datos

### Colección `productos` – Modelo Referenciado

```json
{
  "_id": "PROD01",
  "nombre": "Laptop Gamer",
  "precio": 1500,
  "stock": 10,
  "categoria": "Tecnologia"
}
```

### Colección `pedidos` – Modelo Híbrido

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

> **Embebido:** el objeto `cliente` vive dentro del pedido (datos estáticos).  
> **Referenciado:** `items` usa `producto_id` en lugar de duplicar los datos del producto (datos dinámicos como precio o stock).

---

## 💡 Conceptos demostrados

- **Modelo embebido:** datos anidados dentro del mismo documento, consulta más rápida, menos operaciones.
- **Modelo referenciado:** separación de datos mediante IDs, evita duplicación, facilita actualizaciones centralizadas.
- **Flexibilidad de esquema:** el operador `$set` agrega campos a documentos individuales sin afectar el resto de la colección.
- **Documentos heterogéneos:** cada documento puede tener campos distintos sin alterar el sistema.

---

## 🔧 Comandos útiles de Docker

```bash
# Ver contenedores corriendo
docker ps

# Detener el contenedor
docker-compose down

# Ver logs de MongoDB
docker logs taller-nosql

# Reiniciar el contenedor
docker-compose restart
```

---

## ❓ Solución de problemas

**El contenedor no inicia:**
- Verifica que Docker Desktop esté abierto y corriendo.
- Asegúrate de que el puerto 27017 no esté en uso por otra instancia de MongoDB.

**VS Code no conecta:**
- Confirma que el contenedor está corriendo con `docker ps`.
- Usa exactamente `mongodb://localhost:27017` como cadena de conexión.

**Error al ejecutar el script:**
- Asegúrate de tener seleccionada la base de datos correcta (`AlmacenTaller`).
- Ejecuta primero `00_reset.js` si ya existían datos previos.
