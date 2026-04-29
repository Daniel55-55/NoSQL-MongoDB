// ============================================================
// TALLER NoSQL - MongoDB | AlmacenTaller
// PASO 1: Crear la base de datos e insertar documentos
// ============================================================
// Ejecutar este archivo desde VS Code con la extension MongoDB
// o desde MongoDB Shell con: load("01_script_taller.js")
// ============================================================

// 1. Seleccionar / crear la base de datos
use('AlmacenTaller');

// -------------------------------------------------------
// 2. COLECCION: productos (modelo REFERENCIADO)
//    Los productos se guardan en su propia coleccion.
//    Los pedidos solo almacenan el _id del producto.
// -------------------------------------------------------
db.productos.insertMany([
  {
    _id: "PROD01",
    nombre: "Laptop Gamer",
    descripcion: "Laptop de alto rendimiento para gaming",
    precio: 1500,
    stock: 10,
    categoria: "Tecnologia"
  },
  {
    _id: "PROD02",
    nombre: "Mouse Inalambrico",
    descripcion: "Mouse ergonomico con bateria recargable",
    precio: 45,
    stock: 50,
    categoria: "Accesorios"
  },
  {
    _id: "PROD03",
    nombre: "Teclado Mecanico",
    descripcion: "Teclado con switches Cherry MX",
    precio: 120,
    stock: 25,
    categoria: "Accesorios"
  }
]);

// -------------------------------------------------------
// 3. COLECCION: pedidos
//    Modelo HIBRIDO:
//    - Cliente: EMBEBIDO (datos estaticos, no cambian)
//    - Items:   REFERENCIADOS (solo producto_id)
// -------------------------------------------------------
db.pedidos.insertMany([
  {
    nro_factura: 1001,
    fecha: new Date("2025-04-01"),
    estado: "entregado",
    // EMBEBIDO: el cliente se guarda dentro del pedido
    cliente: {
      nombre: "Juan Perez",
      tipo: "Premium",
      ciudad: "Bogota",
      email: "juan.perez@email.com"
    },
    // REFERENCIADO: solo el ID del producto
    items: [
      { producto_id: "PROD01", cantidad: 1, subtotal: 1500 },
      { producto_id: "PROD02", cantidad: 2, subtotal: 90  }
    ],
    total: 1590
  },
  {
    nro_factura: 1002,
    fecha: new Date("2025-04-10"),
    estado: "pendiente",
    cliente: {
      nombre: "Maria Lopez",
      tipo: "Estandar",
      ciudad: "Medellin",
      email: "maria.lopez@email.com"
    },
    items: [
      { producto_id: "PROD03", cantidad: 1, subtotal: 120 }
    ],
    total: 120
  }
]);

// -------------------------------------------------------
// 4. Verificar inserciones
// -------------------------------------------------------
print("\n--- Productos insertados ---");
db.productos.find().forEach(printjson);

print("\n--- Pedidos insertados ---");
db.pedidos.find().forEach(printjson);
