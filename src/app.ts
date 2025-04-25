import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { PrismaUserRepository } from './infrastructure/prisma/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserController } from './interfaces/http/controllers/user.controller';
import { createUserRoutes } from './interfaces/http/routes/user.routes';

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());

// Middleware de logging
app.use(morgan('dev'));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar dependencias
const userRepository = new PrismaUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userController = new UserController(createUserUseCase);

// Configurar rutas
const userRoutes = createUserRoutes(userController);
app.use('/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
  },
);

export default app;
