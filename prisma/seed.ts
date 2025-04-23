import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123', // En producción, esto debería estar hasheado
      },
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        password: 'user123', // En producción, esto debería estar hasheado
      },
    }),
  ]);

  console.log('Base de datos sembrada con éxito:', users);
}

main()
  .catch((e) => {
    console.error('Error sembrando la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
