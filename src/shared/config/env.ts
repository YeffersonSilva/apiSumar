import { config } from 'dotenv';

config();

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  // Agrega aquí más variables de entorno según necesites
} as const;
