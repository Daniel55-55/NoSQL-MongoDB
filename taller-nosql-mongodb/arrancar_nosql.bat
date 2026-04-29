@echo off
echo ============================================
echo   Taller NoSQL - MongoDB con Docker
echo ============================================
echo.

:: Verifica si Docker esta corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no esta corriendo. Por favor abre Docker Desktop primero.
    pause
    exit /b 1
)

:: Levanta el contenedor con docker-compose
echo [INFO] Iniciando contenedor MongoDB...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] No se pudo iniciar el contenedor.
    pause
    exit /b 1
)

echo.
echo [OK] Contenedor iniciado correctamente.
echo [OK] MongoDB disponible en: mongodb://localhost:27017
echo.
echo Ahora abre VS Code y conectate usando la extension de MongoDB.
echo Cadena de conexion: mongodb://localhost:27017
echo.
pause
