import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function seed() {
  try {
    const totalUsers = await prisma.user.count();

    if (totalUsers > 0) {
      console.log('Seed concluído. Nenhum dado foi inserido.');
      return;
    }

    await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'John Doe',
        email: 'johnDue@store.com.br',
        documentType: 'CPF',
        document: '123.456.789-00',
        passwordHash: hashSync('storeUser', 6),
        type: 'COMMON',
        bankAccount: {
          create: {
            id: randomUUID(),
          },
        },
      },
    });

    console.log('Seed concluído com sucesso:');
  } catch (error) {
    console.error('Erro ao executar a seed:', error);
  }
}

async function run() {
  await seed();
}

run()
  .then(() => {
    console.log('Todas as seeds foram executadas');
  })
  .catch((error) => {
    console.error('Erro ao executar a seed:', error);
  });
