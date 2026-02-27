# 🐆 Jaguar Inventory System

Sistema de gestión de inventario de sacos con autenticación JWT y roles de usuario.

## 🚀 Características

- **Autenticación JWT** con roles de usuario
- **Dashboard interactivo** con KPIs en tiempo real
- **Gestión de inventario** completa
- **Interfaz responsive** con modo dark/light
- **Sidebar colapsable** para mejor UX
- **Sistema de roles** granular
- **Componentes reutilizables** con Flowbite React

## 👥 Roles de Usuario

- **ADMIN**: Acceso completo al sistema
- **COMPRAS**: Gestión de pedidos y compras
- **ALMACEN**: Recepción y etiquetado
- **VENDEDOR**: Listas y proformas
- **PAGOS**: Gestión de pagos y conciliación
- **DESPACHO**: Gestión de despachos

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Flowbite React
- **Estado**: Zustand
- **Autenticación**: JWT
- **Iconos**: React Icons (Heroicons)
- **Notificaciones**: React Hot Toast

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd jaguar-inventory
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   Edita `.env.local` con tus configuraciones.

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Páginas de autenticación
│   ├── (private)/         # Páginas protegidas
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes de UI
├── lib/                  # Utilidades y configuraciones
├── store/                # Estado global (Zustand)
├── types/                # Definiciones de TypeScript
└── public/               # Archivos estáticos
```
<img width="700" height="400" alt="image" src="https://github.com/user-attachments/assets/c42241e6-9587-4a3a-9cc7-b5530ac037c2" />
<img width="700" height="400" alt="image" src="https://github.com/user-attachments/assets/bb42039e-29be-4983-a2ce-8e82286fcabf" />
<img width="700" height="400" alt="image" src="https://github.com/user-attachments/assets/1616e55f-c88c-48bf-9c52-2e9165be9e36" />
<img width="700" height="400" alt="image" src="https://github.com/user-attachments/assets/ac20f033-d51a-42a5-9a25-dc335f2e0c13" />
<img width="700" height="400" alt="image" src="https://github.com/user-attachments/assets/9edbedb0-805d-4525-ae21-90e4802c0438" />
<img width="700" height="400" alt="image" src="https://github.com/user-attachments/assets/55e8755e-c45d-411b-8103-9a8243fc6046" />





## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 🎨 Personalización

### Colores del Tema
El sistema usa una paleta de colores personalizada basada en tonos dorados y café:
- **Jaguar**: Tonos dorados principales
- **Coffee**: Tonos café complementarios
- **Dark**: Tonos oscuros para modo dark

### Componentes
Los componentes están diseñados para ser reutilizables y siguen las mejores prácticas de React.

## 🔐 Autenticación

El sistema utiliza JWT para la autenticación. Los tokens se almacenan de forma segura y se validan en cada request.

### Flujo de Autenticación
1. Login con credenciales
2. Recepción de JWT token
3. Almacenamiento seguro del token
4. Validación automática en rutas protegidas

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa con sidebar expandido
- **Tablet**: Sidebar colapsable automático
- **Mobile**: Sidebar overlay con navegación táctil

## 🌙 Modo Dark/Light

- Persistencia automática de preferencias
- Transiciones suaves entre modos
- Optimización para ambos temas

## 🚀 Despliegue

### Vercel (Recomendado)
**Despliegue con un clic**: 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/jaguar-inventory)

**O manualmente**:
1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. **No configures variables de entorno** (usará Mock API automáticamente)
3. Haz clic en "Deploy"

Ver [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) para más detalles.

### Docker
```bash
docker build -t jaguar-inventory .
docker run -p 3000:3000 jaguar-inventory
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para Jaguar Inventory System**
