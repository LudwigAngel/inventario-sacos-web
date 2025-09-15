# 🤝 Guía de Contribución

## 📋 Antes de Contribuir

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Configura** el repositorio upstream
4. **Crea** una rama para tu feature

## 🔧 Configuración del Entorno

```bash
# Clonar tu fork
git clone https://github.com/tu-usuario/jaguar-inventory.git
cd jaguar-inventory

# Configurar upstream
git remote add upstream https://github.com/original-repo/jaguar-inventory.git

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

## 🌿 Flujo de Trabajo con Git

### 1. Crear una Nueva Rama
```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear nueva rama
git checkout -b feature/nombre-del-feature
```

### 2. Realizar Cambios
```bash
# Hacer tus cambios...

# Verificar estado
git status

# Agregar archivos
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar funcionalidad de X"
```

### 3. Mantener la Rama Actualizada
```bash
# Obtener últimos cambios
git fetch upstream

# Rebase con main
git rebase upstream/main
```

### 4. Subir Cambios
```bash
# Push a tu fork
git push origin feature/nombre-del-feature
```

## 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat: agregar sidebar colapsable"
git commit -m "fix: corregir persistencia del tema dark"
git commit -m "docs: actualizar README con instrucciones"
```

## 🧪 Testing

```bash
# Ejecutar linting
npm run lint

# Verificar tipos
npm run type-check

# Build de producción
npm run build
```

## 📋 Checklist antes del PR

- [ ] El código sigue las convenciones del proyecto
- [ ] Se agregaron tests si es necesario
- [ ] La documentación está actualizada
- [ ] El build pasa sin errores
- [ ] El linting pasa sin errores
- [ ] Los commits siguen las convenciones

## 🔍 Revisión de Código

### Para Revisores:
- Verificar funcionalidad
- Revisar performance
- Comprobar accesibilidad
- Validar seguridad
- Confirmar que sigue las mejores prácticas

### Para Contribuidores:
- Responder a comentarios constructivamente
- Realizar cambios solicitados
- Mantener la rama actualizada

## 🚀 Proceso de Merge

1. **PR Review**: Al menos una aprobación requerida
2. **CI/CD**: Todos los checks deben pasar
3. **Merge**: Squash and merge preferido
4. **Cleanup**: Eliminar rama después del merge

## 📞 Ayuda

Si necesitas ayuda:
- Revisa la documentación existente
- Busca en issues cerrados
- Crea un nuevo issue con la etiqueta `question`
- Contacta al equipo de desarrollo

## 🎯 Áreas de Contribución

### Frontend
- Componentes UI
- Mejoras de UX/UI
- Optimizaciones de performance
- Responsive design

### Backend Integration
- APIs y endpoints
- Manejo de errores
- Validaciones
- Seguridad

### Documentación
- README improvements
- Code comments
- API documentation
- User guides

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

¡Gracias por contribuir al proyecto! 🎉