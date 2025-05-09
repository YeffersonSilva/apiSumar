import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { UserController } from './user-management/infra/controllers/user.controller';
import { createUserRoutes } from './user-management/routes/user.routes';
import { createAuthRoutes } from './user-management/routes/auth.routes';
import { errorHandler } from './shared/middleware/error-handler.middleware';

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Inicializar controladores
const userController = new UserController();

// Configurar rutas
const userRoutes = createUserRoutes(userController);
const authRoutes = createAuthRoutes();

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Middleware de manejo de errores global
app.use(errorHandler);

export { app };
