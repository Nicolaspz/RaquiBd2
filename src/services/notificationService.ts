import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Salvar ou atualizar o token
export const saveToken = async (userId: string, expoToken: string) => {
  return await prisma.token.upsert({
    where: { userId },
    update: { expoToken },
    create: { userId, expoToken },
  });
};

// Buscar o token de um usuário
export const getTokenByUserId = async (userId: string) => {
  return await prisma.token.findUnique({ where: { userId } });
};
