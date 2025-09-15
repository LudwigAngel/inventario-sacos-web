#!/bin/bash

# Script de despliegue para Vercel
echo "🚀 Iniciando despliegue a Vercel..."

# Verificar que estamos en la rama correcta
BRANCH=$(git branch --show-current)
echo "📍 Rama actual: $BRANCH"

# Limpiar cache y dependencias
echo "🧹 Limpiando cache..."
npm run clean
rm -rf node_modules package-lock.json

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar tipos
echo "🔍 Verificando tipos de TypeScript..."
npm run type-check

# Ejecutar linting
echo "🔧 Ejecutando linting..."
npm run lint

# Build de prueba
echo "🏗️ Ejecutando build de prueba..."
npm run build

# Si todo está bien, hacer commit y push
if [ $? -eq 0 ]; then
    echo "✅ Build exitoso. Preparando para despliegue..."
    
    # Agregar cambios si los hay
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 Agregando cambios..."
        git add .
        git commit -m "chore: preparar para despliegue a Vercel"
    fi
    
    # Push a la rama
    echo "⬆️ Subiendo cambios..."
    git push origin $BRANCH
    
    echo "🎉 ¡Listo para desplegar en Vercel!"
    echo ""
    echo "Próximos pasos:"
    echo "1. Ve a https://vercel.com/dashboard"
    echo "2. Importa tu repositorio"
    echo "3. Configura las variables de entorno"
    echo "4. ¡Despliega!"
    
else
    echo "❌ Error en el build. Revisa los errores antes de desplegar."
    exit 1
fi