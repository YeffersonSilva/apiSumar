import 'reflect-metadata';
import { app } from './app';
import { env } from './shared/config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Ambiente: ${env.NODE_ENV}`);
});
