#!/bin/bash
echo "============================================"
echo "  Taller NoSQL - MongoDB + ETL + SQLite"
echo "============================================"
echo ""

if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker no esta corriendo."
    exit 1
fi

echo "[INFO] Iniciando 3 contenedores MongoDB..."
docker-compose up -d

echo "[INFO] Esperando que MongoDB inicie (6 seg)..."
sleep 6

echo "[INFO] Instalando pymongo si no esta..."
pip install pymongo --break-system-packages -q 2>/dev/null || pip install pymongo -q

echo "[INFO] Cargando JSON en MongoDB..."
python scripts/01_cargar_json_mongo.py

echo "[INFO] Ejecutando ETL MongoDB → SQLite..."
python scripts/02_etl_mongo_sqlite.py

echo ""
echo "============================================"
echo "  TODO LISTO"
echo "  mongodb_personas:  localhost:27018"
echo "  mongodb_articulos: localhost:27017"
echo "  mongodb_ventas:    localhost:27019"
echo "  SQLite: data/almacen.sqlite"
echo "  Logs:   data/debug.log"
echo "============================================"
