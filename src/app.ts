import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { UserController } from './user-management/infra/controllers/user.controller';
import { createUserRoutes } from './user-management/routes/user.routes';

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

export { app };
