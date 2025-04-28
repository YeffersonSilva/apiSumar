# API Sumar

RESTful API developed with Node.js, Express, and TypeScript following Clean Architecture principles.

## 🚀 Features

- Clean and modular architecture
- User authentication
- PostgreSQL database with Prisma ORM
- Data validation with Zod
- Security with Helmet and CORS
- Logging with Morgan
- Testing with Jest
- Code linting and formatting with ESLint and Prettier

## 🛠️ Technologies

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Security**: Helmet, CORS, bcrypt
- **Testing**: Jest, Supertest
- **Linting**: ESLint, Prettier

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/api-sumar.git
   cd api-sumar
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/api_sumar"
   PORT=3000
   ```

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

## 🚀 Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
api-sumar/
├── src/
│   ├── application/     # Use cases
│   ├── domain/          # Entities and business rules
│   ├── infrastructure/  # Repository implementations
│   ├── interfaces/      # Controllers and routes
│   ├── config/          # Application configuration
│   ├── app.ts           # Express configuration
│   └── index.ts         # Entry point
├── prisma/
│   ├── migrations/      # Database migrations
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── tests/               # Tests
└── ...
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

## 📝 Available Scripts

- `npm run dev`: Start the server in development mode
- `npm run build`: Build the project
- `npm start`: Start the server in production mode
- `npm run lint`: Run the linter
- `npm run lint:fix`: Fix linting issues
- `npm run format`: Format the code
- `npm run test`: Run tests
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run migrations
- `npm run prisma:studio`: Open Prisma Studio
- `npm run db:setup`: Set up the database

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
