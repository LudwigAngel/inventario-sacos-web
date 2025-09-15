# 🚀 Despliegue en Vercel

## Configuración Rápida

### 1. Conectar Repositorio
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa este repositorio

### 2. Variables de Entorno (Opcional)

#### Para usar Mock API (Recomendado para Demo):
**No configures ninguna variable de entorno**. La aplicación usará automáticamente datos simulados.

#### Para usar API Real:
En el dashboard de Vercel, configura:
```
NEXT_PUBLIC_API_URL=https://tu-backend-api.com
```

### 3. Configuración de Build
Vercel detectará automáticamente que es un proyecto Next.js. No necesitas configurar nada adicional.

### 4. Desplegar
Haz clic en "Deploy" y espera a que termine el proceso.

## 🎯 Características en Vercel

### ✅ Funciona Automáticamente:
- **Mock API**: Datos simulados completos
- **Autenticación**: Sistema de login con roles
- **Todas las páginas**: Dashboard, inventario, ventas, etc.
- **Modo Dark/Light**: Persistente entre sesiones
- **Responsive**: Optimizado para móvil y desktop

### 🔐 Credenciales de Demo:
- **Admin**: `admin` / `admin123`
- **Vendedor**: `vendedor` / `vendedor123`
- **Almacén**: `almacen` / `almacen123`
- **Compras**: `compras` / `compras123`

## 🛠️ Configuración Avanzada

### Variables de Entorno Disponibles:
```bash
# API (opcional)
NEXT_PUBLIC_API_URL=https://tu-api.com

# Aplicación (opcional)
NEXT_PUBLIC_APP_NAME="Tu Nombre de App"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Dominios Personalizados:
1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio personalizado

### Optimizaciones Automáticas:
- ✅ **Compresión automática**
- ✅ **CDN global**
- ✅ **Optimización de imágenes**
- ✅ **Splitting de código**
- ✅ **Caching inteligente**

## 🔧 Solución de Problemas

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"
**Solución**: No configures `NEXT_PUBLIC_API_URL` en Vercel. La app usará automáticamente Mock API.

### La aplicación no carga:
1. Verifica que el build haya sido exitoso
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que no hay variables de entorno mal configuradas

### Datos no se guardan:
Esto es normal con Mock API. Los datos se resetean en cada despliegue. Para persistencia real, necesitas configurar un backend.

## 📊 Monitoreo

### Analytics Integrados:
Vercel proporciona analytics automáticos:
- Visitas por página
- Performance metrics
- Core Web Vitals

### Logs:
Accede a los logs en tiempo real desde el dashboard de Vercel.

## 🚀 Próximos Pasos

1. **Personaliza la marca**: Cambia logos y colores en el código
2. **Conecta backend real**: Configura `NEXT_PUBLIC_API_URL`
3. **Dominio personalizado**: Agrega tu propio dominio
4. **Analytics**: Configura Google Analytics o similar

---

**¡Tu aplicación está lista para usar en Vercel! 🎉**