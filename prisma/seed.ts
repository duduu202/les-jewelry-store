import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  const masterExists = await prisma.user.findUnique({
    where: {
      email: 'master@mestres.com',
    },
  });
  let master;

  if (!masterExists) {
    master = await prisma.user.upsert({
      create: {
        email: 'master@mestres.com',
        name: 'Master',
        password: hashSync('12345678', 8),
        role: 'Master',
      },
      update: {},
      where: {
        email: 'master@mestres.com',
      },
    });
  }
  if (masterExists) {
    // update
    master = await prisma.user.update({
      where: {
        email: 'master@mestres.com',
      },
      data: {
        email: 'master@mestres.com',
        name: 'Master',
        password: hashSync('12345678', 8),
        role: 'Master',
      },
    });
  }

  if (!master) {
    throw new Error('error creating master user');
  }

  console.log({ master });
  prisma.$connect();
};

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
