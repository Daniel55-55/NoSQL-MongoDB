#!/bin/bash
echo "============================================"
echo "  Taller NoSQL - MongoDB con Docker"
echo "============================================"
echo ""

# Verifica si Docker esta corriendo
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker no esta corriendo. Por favor inicia Docker primero."
    exit 1
fi

echo "[INFO] Iniciando contenedor MongoDB..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "[ERROR] No se pudo iniciar el contenedor."
    exit 1
fi

echo ""
echo "[OK] Contenedor iniciado correctamente."
echo "[OK] MongoDB disponible en: mongodb://localhost:27017"
echo ""
echo "Ahora abre VS Code y conectate usando la extension de MongoDB."
echo "Cadena de conexion: mongodb://localhost:27017"
