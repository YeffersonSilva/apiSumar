# API Sumar

API RESTful desarrollada con Node.js, Express y TypeScript siguiendo los principios de Clean Architecture.

## 🚀 Características

- Arquitectura limpia y modular
- Autenticación de usuarios
- Base de datos PostgreSQL con Prisma ORM
- Validación de datos con Zod
- Seguridad con Helmet y CORS
- Logging con Morgan
- Testing con Jest
- Linting y formateo de código con ESLint y Prettier

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, TypeScript
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod
- **Seguridad**: Helmet, CORS, bcrypt
- **Testing**: Jest, Supertest
- **Linting**: ESLint, Prettier

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/api-sumar.git
   cd api-sumar
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/api_sumar"
   PORT=3000
   ```

4. Genera el cliente de Prisma:

   ```bash
   npm run prisma:generate
   ```

5. Ejecuta las migraciones:
   ```bash
   npm run prisma:migrate
   ```

## 🚀 Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
api-sumar/
├── src/
│   ├── application/     # Casos de uso
│   ├── domain/          # Entidades y reglas de negocio
│   ├── infrastructure/  # Implementaciones de repositorios
│   ├── interfaces/      # Controladores y rutas
│   ├── config/          # Configuración de la aplicación
│   ├── app.ts           # Configuración de Express
│   └── index.ts         # Punto de entrada
├── prisma/
│   ├── migrations/      # Migraciones de la base de datos
│   ├── schema.prisma    # Esquema de la base de datos
│   └── seed.ts          # Datos iniciales
├── tests/               # Pruebas
└── ...
```

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar cobertura de pruebas
npm run test:coverage
```

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm start`: Inicia el servidor en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run lint:fix`: Corrige problemas de linting
- `npm run format`: Formatea el código
- `npm run test`: Ejecuta las pruebas
- `npm run prisma:generate`: Genera el cliente de Prisma
- `npm run prisma:migrate`: Ejecuta las migraciones
- `npm run prisma:studio`: Abre Prisma Studio
- `npm run db:setup`: Configura la base de datos

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'feat: add some amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
