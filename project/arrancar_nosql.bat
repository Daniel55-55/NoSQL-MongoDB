@echo off
echo ============================================
echo   Taller NoSQL - MongoDB + ETL + SQLite
echo ============================================
echo.

:: ── 1. Verificar Docker ─────────────────────────────────
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta corriendo. Abre Docker Desktop primero.
    pause
    exit /b 1
)

:: ── 2. Levantar las 3 bases MongoDB ─────────────────────
echo [INFO] Iniciando 3 contenedores MongoDB...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] No se pudo iniciar los contenedores.
    pause
    exit /b 1
)

echo [OK] mongodb_personas  → puerto 27018
echo [OK] mongodb_articulos → puerto 27017
echo [OK] mongodb_ventas    → puerto 27019
echo.

:: ── 3. Esperar que MongoDB este listo ────────────────────
echo [INFO] Esperando que MongoDB inicie (6 seg)...
timeout /t 6 >nul

:: ── 4. Instalar pymongo si no esta ──────────────────────
echo [INFO] Verificando pymongo...
python -c "import pymongo" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Instalando pymongo...
    pip install pymongo >nul 2>&1
)

:: ── 5. Cargar JSON en MongoDB ────────────────────────────
echo [INFO] Cargando JSON en MongoDB (POST /load_data)...
python scripts\01_cargar_json_mongo.py

if %errorlevel% neq 0 (
    echo [WARN] Error al cargar JSON. Revisa data\debug.log
) else (
    echo [OK] Datos cargados en las 3 bases MongoDB
)
echo.

:: ── 6. Ejecutar ETL MongoDB → SQLite ────────────────────
echo [INFO] Ejecutando ETL (POST /etl)...
python scripts\02_etl_mongo_sqlite.py

if %errorlevel% neq 0 (
    echo [WARN] ETL con errores. Revisa data\debug.log
) else (
    echo [OK] SQLite generado en data\almacen.sqlite
)
echo.

:: ── 7. Abrir VS Code ─────────────────────────────────────
echo [INFO] Abriendo VS Code...
code .

echo.
echo ============================================
echo   TODO LISTO
echo   mongodb_personas:  localhost:27018
echo   mongodb_articulos: localhost:27017
echo   mongodb_ventas:    localhost:27019
echo   SQLite:  data\almacen.sqlite
echo   Logs:    data\debug.log
echo   Jupyter: notebooks\proyectoBDM.ipynb
echo ============================================
echo.
echo Proximos pasos:
echo   - Conecta VS Code a MongoDB: mongodb://localhost:27017
echo   - Abre el notebook: jupyter notebook notebooks/proyectoBDM.ipynb
echo   - Consultas SQLite: python scripts\03_consultas_sqlite.py
echo.
pause
