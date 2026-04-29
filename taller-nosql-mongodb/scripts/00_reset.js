// ============================================================
// TALLER NoSQL - MongoDB | AlmacenTaller
// RESET: Limpiar la base de datos para volver a empezar
// ============================================================
// Util para repetir el taller desde cero
// ============================================================

use('AlmacenTaller');

print("Eliminando colecciones...");
db.pedidos.drop();
db.productos.drop();
print("Base de datos limpia. Ejecuta 01_script_taller.js para reiniciar.");
