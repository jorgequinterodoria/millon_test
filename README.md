
## 🏛 Arquitectura

El proyecto sigue los principios de **Clean Architecture**:

### Capas:

1. **Core (Domain)**: Entidades, DTOs e interfaces
   - Sin dependencias externas
   - Lógica de negocio pura

2. **Application**: Servicios y casos de uso
   - Implementa la lógica de aplicación
   - Depende solo de Core

3. **Infrastructure**: Acceso a datos
   - Implementa repositorios
   - Configuración de MongoDB
   - Depende de Core

4. **API (Presentation)**: Controllers y configuración
   - Punto de entrada HTTP
   - Depende de Application e Infrastructure

### Principios aplicados:

- ✅ Separation of Concerns
- ✅ Dependency Inversion
- ✅ Single Responsibility
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID Principles

## 🔍 Características de Implementación

### Backend

- **Filtros optimizados**: Búsqueda con expresiones regulares insensibles a mayúsculas
- **Índices de MongoDB**: Creados automáticamente para mejorar rendimiento
- **Paginación**: Implementada en todas las consultas de lista
- **Manejo de errores**: Try-catch en todos los endpoints con logging
- **Validación**: ModelState validation en DTOs
- **CORS**: Configurado para desarrollo frontend

### Frontend

- **Responsive Design**: Compatible con dispositivos móviles y desktop
- **Debouncing**: En filtros de búsqueda para evitar llamadas excesivas
- **Estado global**: Gestión con TanStack Query y SWR
- **Error Boundaries**: Manejo elegante de errores
- **Loading States**: Indicadores de carga para mejor UX
- **TypeScript**: Tipado estático para mejor desarrollo
- **ShadCN/UI**: Componentes modernos y accesibles

## 🐛 Troubleshooting

### MongoDB no inicia

```bash
# macOS
brew services restart mongodb-community

# Verificar logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### API no conecta a MongoDB

- Verificar que MongoDB esté corriendo: `mongosh`
- Verificar ConnectionString en `appsettings.json`
- Verificar que la base de datos existe: `show dbs`
- **Asegúrate de haber configurado tu propia cadena de conexión**

### CORS errors en frontend

- Verificar que la URL del frontend esté en `appsettings.json` bajo `Cors:AllowedOrigins`
- Asegurarse que el backend esté corriendo
- Revisar la consola del navegador para detalles

### Puerto del backend diferente

- El puerto puede variar entre ejecuciones
- Verificar el puerto en la consola del backend
- Actualizar `VITE_API_URL` en `.env.local` si es necesario

## 📝 Notas de Desarrollo

### Convenciones de código:

- **C#**: PascalCase para clases y métodos, camelCase para variables
- **TypeScript**: camelCase para variables y funciones, PascalCase para componentes
- **Async/Await**: Todos los métodos de repositorio y servicios son asíncronos
- **Logging**: Usar ILogger para registrar eventos importantes
- **Comments**: Comentar solo lógica compleja, el código debe ser autodescriptivo

### Tecnologías clave:

- **Fetch API**: Se usa en lugar de Axios para peticiones HTTP
- **Vite**: Build tool rápido para desarrollo
- **ShadCN/UI**: Sistema de componentes moderno
- **TanStack Query**: Para gestión de estado del servidor

## 👥 Contacto

Para preguntas o soporte, contactar a: jquintedori@gmail.com

## 📄 Licencia

Este proyecto es una prueba técnica para evaluación.