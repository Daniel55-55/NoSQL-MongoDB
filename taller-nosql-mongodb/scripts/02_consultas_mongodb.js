// ============================================================
// TALLER NoSQL - MongoDB | AlmacenTaller
// PASO 2: Consultas y modificacion de documentos
// ============================================================
// Ejecutar DESPUES de 01_script_taller.js
// ============================================================

use('AlmacenTaller');

// -------------------------------------------------------
// CONSULTAS BASICAS
// -------------------------------------------------------

// 1. Ver todos los pedidos
print("\n[1] Todos los pedidos:");
db.pedidos.find().forEach(printjson);

// 2. Buscar un pedido especifico por numero de factura
print("\n[2] Pedido nro_factura 1001:");
db.pedidos.find({ nro_factura: 1001 }).forEach(printjson);

// 3. Buscar pedidos por estado
print("\n[3] Pedidos pendientes:");
db.pedidos.find({ estado: "pendiente" }).forEach(printjson);

// 4. Buscar por campo embebido (ciudad del cliente)
print("\n[4] Pedidos de clientes en Bogota:");
db.pedidos.find({ "cliente.ciudad": "Bogota" }).forEach(printjson);

// 5. Buscar productos por categoria
print("\n[5] Productos de categoria Accesorios:");
db.productos.find({ categoria: "Accesorios" }).forEach(printjson);

// -------------------------------------------------------
// MODIFICACIONES CON $set (flexibilidad NoSQL)
// -------------------------------------------------------

// 6. Agregar campos nuevos a UN documento sin afectar los demas
//    Esto demuestra la flexibilidad: solo el pedido 1001
//    tendra estos campos, el 1002 no se ve afectado.
print("\n[6] Actualizando pedido 1001 con campos nuevos...");
db.pedidos.updateOne(
  { nro_factura: 1001 },
  {
    $set: {
      garantia_extendida: true,
      observaciones: "Entregar en porteria",
      fecha_entrega: new Date("2025-04-05")
    }
  }
);

// 7. Cambiar estado de un pedido
print("\n[7] Cambiando estado del pedido 1002 a 'enviado'...");
db.pedidos.updateOne(
  { nro_factura: 1002 },
  { $set: { estado: "enviado" } }
);

// 8. Actualizar stock de un producto (decremento)
print("\n[8] Reduciendo stock de PROD01 en 1 unidad...");
db.productos.updateOne(
  { _id: "PROD01" },
  { $inc: { stock: -1 } }
);

// -------------------------------------------------------
// VERIFICACION FINAL
// -------------------------------------------------------
print("\n--- Estado final de pedidos ---");
db.pedidos.find().forEach(printjson);

print("\n--- Estado final de productos ---");
db.productos.find().forEach(printjson);

// -------------------------------------------------------
// CONSULTAS AVANZADAS
// -------------------------------------------------------

// 9. Solo mostrar ciertos campos (proyeccion)
print("\n[9] Solo nombre y total de cada pedido:");
db.pedidos.find({}, { "cliente.nombre": 1, total: 1, nro_factura: 1, _id: 0 }).forEach(printjson);

// 10. Ordenar pedidos por total descendente
print("\n[10] Pedidos ordenados por total (mayor a menor):");
db.pedidos.find().sort({ total: -1 }).forEach(printjson);
