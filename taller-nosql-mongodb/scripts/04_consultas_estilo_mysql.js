// ============================================================
// TALLER NoSQL - MongoDB | AlmacenTaller
// CONSULTAS ESTILO MySQL → Equivalente en MongoDB
// ============================================================

use('AlmacenTaller');

// ============================================================
// MySQL:  SELECT * FROM productos;
// ============================================================
print("\n[1] SELECT * FROM productos");
db.productos.find();

// ============================================================
// MySQL:  SELECT * FROM pedidos;
// ============================================================
print("\n[2] SELECT * FROM pedidos");
db.pedidos.find();

// ============================================================
// MySQL:  SELECT nombre, precio, stock FROM productos;
// ============================================================
print("\n[3] SELECT nombre, precio, stock FROM productos");
db.productos.find({}, { nombre: 1, precio: 1, stock: 1, _id: 0 });

// ============================================================
// MySQL:  SELECT * FROM productos WHERE categoria = 'Accesorios';
// ============================================================
print("\n[4] SELECT * FROM productos WHERE categoria = 'Accesorios'");
db.productos.find({ categoria: "Accesorios" });

// ============================================================
// MySQL:  SELECT * FROM productos WHERE precio > 500;
// ============================================================
print("\n[5] SELECT * FROM productos WHERE precio > 500");
db.productos.find({ precio: { $gt: 500 } });

// ============================================================
// MySQL:  SELECT * FROM productos WHERE precio BETWEEN 100 AND 500;
// ============================================================
print("\n[6] SELECT * FROM productos WHERE precio BETWEEN 100 AND 500");
db.productos.find({ precio: { $gte: 100, $lte: 500 } });

// ============================================================
// MySQL:  SELECT * FROM productos ORDER BY precio DESC;
// ============================================================
print("\n[7] SELECT * FROM productos ORDER BY precio DESC");
db.productos.find().sort({ precio: -1 });

// ============================================================
// MySQL:  SELECT * FROM productos ORDER BY precio ASC LIMIT 5;
// ============================================================
print("\n[8] SELECT * FROM productos ORDER BY precio ASC LIMIT 5");
db.productos.find().sort({ precio: 1 }).limit(5);

// ============================================================
// MySQL:  SELECT * FROM productos WHERE nombre LIKE '%Gaming%';
// ============================================================
print("\n[9] SELECT * FROM productos WHERE nombre LIKE '%Gaming%'");
db.productos.find({ nombre: { $regex: "Gaming", $options: "i" } });

// ============================================================
// MySQL:  SELECT COUNT(*) FROM pedidos;
// ============================================================
print("\n[10] SELECT COUNT(*) FROM pedidos");
db.pedidos.countDocuments();

// ============================================================
// MySQL:  SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente';
// ============================================================
print("\n[11] SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente'");
db.pedidos.countDocuments({ estado: "pendiente" });

// ============================================================
// MySQL:  SELECT SUM(total) FROM pedidos;
// ============================================================
print("\n[12] SELECT SUM(total) FROM pedidos");
db.pedidos.aggregate([
  { $group: { _id: null, total_ventas: { $sum: "$total" } } }
]);

// ============================================================
// MySQL:  SELECT SUM(total), estado FROM pedidos GROUP BY estado;
// ============================================================
print("\n[13] SELECT SUM(total), estado FROM pedidos GROUP BY estado");
db.pedidos.aggregate([
  { $group: { _id: "$estado", total: { $sum: "$total" }, cantidad: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);

// ============================================================
// MySQL:  SELECT AVG(total) FROM pedidos;
// ============================================================
print("\n[14] SELECT AVG(total) FROM pedidos");
db.pedidos.aggregate([
  { $group: { _id: null, promedio: { $avg: "$total" } } }
]);

// ============================================================
// MySQL:  SELECT MAX(total), MIN(total) FROM pedidos;
// ============================================================
print("\n[15] SELECT MAX(total), MIN(total) FROM pedidos");
db.pedidos.aggregate([
  { $group: { _id: null, maximo: { $max: "$total" }, minimo: { $min: "$total" } } }
]);

// ============================================================
// MySQL:  SELECT * FROM pedidos WHERE total > 1000 ORDER BY total DESC;
// ============================================================
print("\n[16] SELECT * FROM pedidos WHERE total > 1000 ORDER BY total DESC");
db.pedidos.find({ total: { $gt: 1000 } }).sort({ total: -1 });

// ============================================================
// MySQL:  SELECT cliente_ciudad, COUNT(*) FROM pedidos GROUP BY cliente_ciudad;
//         (campo embebido: cliente.ciudad)
// ============================================================
print("\n[17] SELECT ciudad, COUNT(*) FROM pedidos GROUP BY ciudad");
db.pedidos.aggregate([
  { $group: { _id: "$cliente.ciudad", pedidos: { $sum: 1 }, ventas: { $sum: "$total" } } },
  { $sort: { ventas: -1 } }
]);

// ============================================================
// MySQL:  SELECT * FROM pedidos WHERE cliente_tipo = 'Corporativo';
//         (campo embebido)
// ============================================================
print("\n[18] SELECT * FROM pedidos WHERE cliente.tipo = 'Corporativo'");
db.pedidos.find({ "cliente.tipo": "Corporativo" }, {
  nro_factura: 1, "cliente.nombre": 1, "cliente.ciudad": 1, total: 1, estado: 1, _id: 0
});

// ============================================================
// MySQL:  SELECT * FROM pedidos WHERE metodo_pago = 'Transferencia'
//         ORDER BY total DESC LIMIT 3;
// ============================================================
print("\n[19] Top 3 pedidos por Transferencia");
db.pedidos.find({ metodo_pago: "Transferencia" }).sort({ total: -1 }).limit(3);

// ============================================================
// MySQL:  SELECT categoria, COUNT(*), AVG(precio)
//         FROM productos GROUP BY categoria ORDER BY AVG(precio) DESC;
// ============================================================
print("\n[20] Resumen por categoria de productos");
db.pedidos.aggregate([
  { $group: {
      _id: "$cliente.tipo",
      total_ventas: { $sum: "$total" },
      num_pedidos:  { $sum: 1 },
      ticket_promedio: { $avg: "$total" }
  }},
  { $sort: { total_ventas: -1 } }
]);
