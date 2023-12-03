/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';

export const prisma = new PrismaClient({
  // log: ['query'],
}); // .$extends(withAccelerate());
