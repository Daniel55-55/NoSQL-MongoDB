// ============================================================
// TALLER NoSQL - MongoDB | AlmacenTaller
// DATOS COMPLETOS - Script de carga masiva
// ============================================================

use('AlmacenTaller');

// -------------------------------------------------------
// LIMPIAR datos anteriores antes de insertar
// -------------------------------------------------------
db.productos.drop();
db.pedidos.drop();
db.clientes.drop();
print("Base de datos limpia. Insertando datos...");

// -------------------------------------------------------
// COLECCION: productos (modelo REFERENCIADO)
// -------------------------------------------------------
db.productos.insertMany([
  { _id: "PROD01", nombre: "Laptop Gamer ASUS ROG", descripcion: "Intel i9, RTX 4070, 32GB RAM, 1TB SSD", precio: 2800, stock: 8,  categoria: "Computadores", marca: "ASUS",      garantia_meses: 24 },
  { _id: "PROD02", nombre: "Laptop Dell XPS 15",   descripcion: "Intel i7, RTX 3050, 16GB RAM, 512GB SSD", precio: 1900, stock: 12, categoria: "Computadores", marca: "Dell",      garantia_meses: 12 },
  { _id: "PROD03", nombre: "MacBook Air M2",        descripcion: "Apple M2, 8GB RAM, 256GB SSD, 13 pulgadas", precio: 1300, stock: 15, categoria: "Computadores", marca: "Apple",  garantia_meses: 12 },
  { _id: "PROD04", nombre: "Monitor LG UltraWide 34\"", descripcion: "34 pulgadas, 3440x1440, 144Hz, IPS", precio: 750,  stock: 20, categoria: "Monitores",    marca: "LG",        garantia_meses: 24 },
  { _id: "PROD05", nombre: "Monitor Samsung 27\"",  descripcion: "27 pulgadas, 4K, 60Hz, IPS",              precio: 420,  stock: 30, categoria: "Monitores",    marca: "Samsung",   garantia_meses: 12 },
  { _id: "PROD06", nombre: "Mouse Logitech MX Master 3", descripcion: "Inalambrico, ergonomico, 4000 DPI", precio: 110,  stock: 50, categoria: "Accesorios",   marca: "Logitech",  garantia_meses: 24 },
  { _id: "PROD07", nombre: "Mouse Razer DeathAdder", descripcion: "Gaming, 20000 DPI, RGB",                 precio: 75,   stock: 45, categoria: "Accesorios",   marca: "Razer",     garantia_meses: 12 },
  { _id: "PROD08", nombre: "Teclado Mecanico Corsair K70", descripcion: "Cherry MX Red, RGB, TKL",         precio: 160,  stock: 25, categoria: "Accesorios",   marca: "Corsair",   garantia_meses: 24 },
  { _id: "PROD09", nombre: "Teclado Logitech G915",  descripcion: "Inalambrico, GL Clicky, RGB, 87%",      precio: 230,  stock: 18, categoria: "Accesorios",   marca: "Logitech",  garantia_meses: 24 },
  { _id: "PROD10", nombre: "Auriculares Sony WH-1000XM5", descripcion: "Noise Cancelling, 30h bateria",    precio: 350,  stock: 22, categoria: "Audio",        marca: "Sony",      garantia_meses: 12 },
  { _id: "PROD11", nombre: "Auriculares HyperX Cloud III", descripcion: "Gaming, 7.1 Surround, USB-C",     precio: 120,  stock: 35, categoria: "Audio",        marca: "HyperX",    garantia_meses: 24 },
  { _id: "PROD12", nombre: "SSD Samsung 970 EVO 1TB", descripcion: "NVMe M.2, 3500MB/s lectura",           precio: 90,   stock: 60, categoria: "Almacenamiento", marca: "Samsung", garantia_meses: 60 },
  { _id: "PROD13", nombre: "SSD Kingston 2TB",       descripcion: "SATA III, 550MB/s lectura",              precio: 110,  stock: 40, categoria: "Almacenamiento", marca: "Kingston",garantia_meses: 36 },
  { _id: "PROD14", nombre: "Memoria RAM Corsair 32GB", descripcion: "DDR5, 6000MHz, Kit 2x16GB",           precio: 140,  stock: 30, categoria: "Componentes",  marca: "Corsair",   garantia_meses: 60 },
  { _id: "PROD15", nombre: "Webcam Logitech C920",   descripcion: "Full HD 1080p, 30fps, microfono dual",  precio: 85,   stock: 28, categoria: "Perifericos",  marca: "Logitech",  garantia_meses: 24 },
  { _id: "PROD16", nombre: "Silla Gamer DXRacer",    descripcion: "Reclinable 135°, soporte lumbar, cuero PU", precio: 480, stock: 10, categoria: "Mobiliario", marca: "DXRacer", garantia_meses: 24 },
  { _id: "PROD17", nombre: "Escritorio Gaming L-Shape", descripcion: "180cm, soporte monitor, USB hub",    precio: 320,  stock: 7,  categoria: "Mobiliario",   marca: "Flexispot", garantia_meses: 12 },
  { _id: "PROD18", nombre: "UPS APC 1500VA",         descripcion: "1500VA/900W, 8 tomas, proteccion red",  precio: 200,  stock: 15, categoria: "Energia",      marca: "APC",       garantia_meses: 24 },
  { _id: "PROD19", nombre: "Hub USB-C 7 en 1",       descripcion: "HDMI 4K, USB 3.0x3, SD, PD 100W",      precio: 55,   stock: 55, categoria: "Perifericos",  marca: "Anker",     garantia_meses: 18 },
  { _id: "PROD20", nombre: "Mousepad XXL RGB",        descripcion: "90x40cm, carga inalambrica, RGB",       precio: 65,   stock: 40, categoria: "Accesorios",   marca: "Razer",     garantia_meses: 12 }
]);
print("✅ 20 productos insertados");

// -------------------------------------------------------
// COLECCION: pedidos (modelo HIBRIDO)
// cliente EMBEBIDO | items REFERENCIADOS por producto_id
// -------------------------------------------------------
db.pedidos.insertMany([
  {
    nro_factura: 1001, fecha: new Date("2025-01-05"), estado: "entregado",
    cliente: { nombre: "Juan Perez", tipo: "Premium", ciudad: "Bogota", email: "juan.perez@gmail.com", telefono: "3001234567" },
    items: [
      { producto_id: "PROD01", cantidad: 1, subtotal: 2800 },
      { producto_id: "PROD06", cantidad: 1, subtotal: 110  },
      { producto_id: "PROD08", cantidad: 1, subtotal: 160  }
    ],
    total: 3070, metodo_pago: "Tarjeta Credito",
    garantia_extendida: true, observaciones: "Entregar en porteria"
  },
  {
    nro_factura: 1002, fecha: new Date("2025-01-12"), estado: "entregado",
    cliente: { nombre: "Maria Lopez", tipo: "Estandar", ciudad: "Medellin", email: "maria.lopez@hotmail.com", telefono: "3109876543" },
    items: [
      { producto_id: "PROD03", cantidad: 1, subtotal: 1300 },
      { producto_id: "PROD15", cantidad: 1, subtotal: 85   }
    ],
    total: 1385, metodo_pago: "PSE"
  },
  {
    nro_factura: 1003, fecha: new Date("2025-01-18"), estado: "entregado",
    cliente: { nombre: "Carlos Ramirez", tipo: "Corporativo", ciudad: "Cali", email: "carlos.ramirez@empresa.com", telefono: "3154567890" },
    items: [
      { producto_id: "PROD02", cantidad: 3, subtotal: 5700 },
      { producto_id: "PROD04", cantidad: 3, subtotal: 2250 },
      { producto_id: "PROD06", cantidad: 3, subtotal: 330  }
    ],
    total: 8280, metodo_pago: "Transferencia",
    observaciones: "Factura a nombre de Empresa SAS. NIT: 900123456-1"
  },
  {
    nro_factura: 1004, fecha: new Date("2025-01-25"), estado: "entregado",
    cliente: { nombre: "Ana Torres", tipo: "Premium", ciudad: "Barranquilla", email: "ana.torres@gmail.com", telefono: "3207654321" },
    items: [
      { producto_id: "PROD10", cantidad: 1, subtotal: 350 },
      { producto_id: "PROD19", cantidad: 2, subtotal: 110 },
      { producto_id: "PROD20", cantidad: 1, subtotal: 65  }
    ],
    total: 525, metodo_pago: "Tarjeta Debito"
  },
  {
    nro_factura: 1005, fecha: new Date("2025-02-03"), estado: "entregado",
    cliente: { nombre: "Luis Herrera", tipo: "Estandar", ciudad: "Bucaramanga", email: "luis.herrera@yahoo.com", telefono: "3012345678" },
    items: [
      { producto_id: "PROD12", cantidad: 2, subtotal: 180 },
      { producto_id: "PROD14", cantidad: 1, subtotal: 140 }
    ],
    total: 320, metodo_pago: "Efectivo"
  },
  {
    nro_factura: 1006, fecha: new Date("2025-02-10"), estado: "enviado",
    cliente: { nombre: "Valentina Gomez", tipo: "Premium", ciudad: "Bogota", email: "vgomez@gmail.com", telefono: "3156789012" },
    items: [
      { producto_id: "PROD16", cantidad: 1, subtotal: 480 },
      { producto_id: "PROD17", cantidad: 1, subtotal: 320 },
      { producto_id: "PROD18", cantidad: 1, subtotal: 200 }
    ],
    total: 1000, metodo_pago: "Tarjeta Credito",
    garantia_extendida: true, observaciones: "Llamar antes de entregar"
  },
  {
    nro_factura: 1007, fecha: new Date("2025-02-14"), estado: "entregado",
    cliente: { nombre: "Santiago Moreno", tipo: "Corporativo", ciudad: "Bogota", email: "smoreno@tech.co", telefono: "3001112233" },
    items: [
      { producto_id: "PROD01", cantidad: 5, subtotal: 14000 },
      { producto_id: "PROD05", cantidad: 5, subtotal: 2100  },
      { producto_id: "PROD09", cantidad: 5, subtotal: 1150  },
      { producto_id: "PROD11", cantidad: 5, subtotal: 600   }
    ],
    total: 17850, metodo_pago: "Transferencia",
    observaciones: "Pedido corporativo — equipar sala de sistemas. Factura empresa TechCo SAS"
  },
  {
    nro_factura: 1008, fecha: new Date("2025-02-20"), estado: "entregado",
    cliente: { nombre: "Camila Vargas", tipo: "Estandar", ciudad: "Pereira", email: "cvargas@gmail.com", telefono: "3204445566" },
    items: [
      { producto_id: "PROD07", cantidad: 1, subtotal: 75 },
      { producto_id: "PROD08", cantidad: 1, subtotal: 160 }
    ],
    total: 235, metodo_pago: "PSE"
  },
  {
    nro_factura: 1009, fecha: new Date("2025-03-01"), estado: "entregado",
    cliente: { nombre: "Andres Castro", tipo: "Premium", ciudad: "Manizales", email: "acastro@outlook.com", telefono: "3118889900" },
    items: [
      { producto_id: "PROD02", cantidad: 1, subtotal: 1900 },
      { producto_id: "PROD04", cantidad: 1, subtotal: 750  },
      { producto_id: "PROD12", cantidad: 1, subtotal: 90   },
      { producto_id: "PROD15", cantidad: 1, subtotal: 85   }
    ],
    total: 2825, metodo_pago: "Tarjeta Credito",
    garantia_extendida: true
  },
  {
    nro_factura: 1010, fecha: new Date("2025-03-08"), estado: "entregado",
    cliente: { nombre: "Isabella Rios", tipo: "Estandar", ciudad: "Cali", email: "irios@gmail.com", telefono: "3167778899" },
    items: [
      { producto_id: "PROD13", cantidad: 1, subtotal: 110 },
      { producto_id: "PROD19", cantidad: 1, subtotal: 55  }
    ],
    total: 165, metodo_pago: "Efectivo"
  },
  {
    nro_factura: 1011, fecha: new Date("2025-03-15"), estado: "entregado",
    cliente: { nombre: "Felipe Mendoza", tipo: "Corporativo", ciudad: "Bogota", email: "fmendoza@consultora.co", telefono: "3009876543" },
    items: [
      { producto_id: "PROD03", cantidad: 10, subtotal: 13000 },
      { producto_id: "PROD06", cantidad: 10, subtotal: 1100  },
      { producto_id: "PROD10", cantidad: 10, subtotal: 3500  }
    ],
    total: 17600, metodo_pago: "Transferencia",
    observaciones: "Pedido para consultora. Requiere certificado de garantia por unidad"
  },
  {
    nro_factura: 1012, fecha: new Date("2025-03-22"), estado: "enviado",
    cliente: { nombre: "Laura Pinto", tipo: "Premium", ciudad: "Medellin", email: "lpinto@gmail.com", telefono: "3143334455" },
    items: [
      { producto_id: "PROD01", cantidad: 1, subtotal: 2800 },
      { producto_id: "PROD04", cantidad: 1, subtotal: 750  },
      { producto_id: "PROD08", cantidad: 1, subtotal: 160  },
      { producto_id: "PROD20", cantidad: 1, subtotal: 65   }
    ],
    total: 3775, metodo_pago: "Tarjeta Credito",
    garantia_extendida: true, observaciones: "Setup completo gaming"
  },
  {
    nro_factura: 1013, fecha: new Date("2025-04-01"), estado: "pendiente",
    cliente: { nombre: "Diego Salazar", tipo: "Estandar", ciudad: "Cartagena", email: "dsalazar@hotmail.com", telefono: "3052223344" },
    items: [
      { producto_id: "PROD11", cantidad: 1, subtotal: 120 },
      { producto_id: "PROD07", cantidad: 1, subtotal: 75  }
    ],
    total: 195, metodo_pago: "PSE"
  },
  {
    nro_factura: 1014, fecha: new Date("2025-04-10"), estado: "pendiente",
    cliente: { nombre: "Natalia Cruz", tipo: "Premium", ciudad: "Bogota", email: "ncruz@gmail.com", telefono: "3181112222" },
    items: [
      { producto_id: "PROD16", cantidad: 1, subtotal: 480 },
      { producto_id: "PROD09", cantidad: 1, subtotal: 230 },
      { producto_id: "PROD10", cantidad: 1, subtotal: 350 }
    ],
    total: 1060, metodo_pago: "Tarjeta Credito",
    observaciones: "Confirmar disponibilidad de color negro en silla"
  },
  {
    nro_factura: 1015, fecha: new Date("2025-04-15"), estado: "pendiente",
    cliente: { nombre: "Jorge Gutierrez", tipo: "Corporativo", ciudad: "Bogota", email: "jgutierrez@universidad.edu.co", telefono: "3022223333" },
    items: [
      { producto_id: "PROD02", cantidad: 20, subtotal: 38000 },
      { producto_id: "PROD05", cantidad: 20, subtotal: 8400  },
      { producto_id: "PROD18", cantidad: 5,  subtotal: 1000  }
    ],
    total: 47400, metodo_pago: "Transferencia",
    observaciones: "Licitacion universidad — sala de computo 20 puestos. Requiere factura con IVA desglosado"
  }
]);
print("✅ 15 pedidos insertados");

// -------------------------------------------------------
// AGREGAR campos extra a pedidos especificos
// Demuestra la FLEXIBILIDAD de NoSQL: $set en documentos
// individuales sin afectar los demas
// -------------------------------------------------------
db.pedidos.updateOne(
  { nro_factura: 1001 },
  { $set: { calificacion_cliente: 5, comentario: "Excelente servicio, llegó antes de lo esperado" } }
);
db.pedidos.updateOne(
  { nro_factura: 1003 },
  { $set: { descuento_corporativo: "15%", valor_descuento: 1242, coordinador_cuenta: "Pedro Ruiz" } }
);
db.pedidos.updateOne(
  { nro_factura: 1007 },
  { $set: { descuento_corporativo: "20%", valor_descuento: 4462.5, coordinador_cuenta: "Maria Jimenez", instalacion_incluida: true } }
);
db.pedidos.updateOne(
  { nro_factura: 1011 },
  { $set: { descuento_corporativo: "18%", valor_descuento: 3168, coordinador_cuenta: "Carlos Vega" } }
);
db.pedidos.updateOne(
  { nro_factura: 1015 },
  { $set: { descuento_corporativo: "25%", valor_descuento: 11850, coordinador_cuenta: "Ana Restrepo", instalacion_incluida: true, soporte_tecnico_meses: 12 } }
);
print("✅ Campos adicionales aplicados a pedidos corporativos y destacados");

// -------------------------------------------------------
// RESUMEN FINAL
// -------------------------------------------------------
print("\n========================================");
print("       RESUMEN DE LA BASE DE DATOS      ");
print("========================================");
print("Productos:  " + db.productos.countDocuments());
print("Pedidos:    " + db.pedidos.countDocuments());
print("Pendientes: " + db.pedidos.countDocuments({estado:"pendiente"}));
print("Enviados:   " + db.pedidos.countDocuments({estado:"enviado"}));
print("Entregados: " + db.pedidos.countDocuments({estado:"entregado"}));

const pipeline = db.pedidos.aggregate([{ $group: { _id: null, total_ventas: { $sum: "$total" } } }]).toArray();
print("Total ventas: $" + pipeline[0].total_ventas.toLocaleString());
print("========================================\n");
