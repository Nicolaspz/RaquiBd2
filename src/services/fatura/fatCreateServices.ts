import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CriarFaturaDTO {
  numero: string;
  usuarioId: string;
  data_vencimento: string;
  servicos: string[]; // array de IDs de serviços
}

export const criarFatura = async (
  req: Request<{}, {}, CriarFaturaDTO>,
  res: Response
) => {
  try {
    const { numero, usuarioId, data_vencimento, servicos } = req.body;

    if (!Array.isArray(servicos) || servicos.length === 0) {
      return res.status(400).json({ message: 'Lista de serviços obrigatória' });
    }

    const novaFatura = await prisma.fatura.create({
      data: {
        numero,
        usuarioId,
        data_vencimento: new Date(data_vencimento),
        servicos: {
          connect: servicos.map((id) => ({ id })),
        },
      },
      include: {
        servicos: true,
        usuario: true,
      },
    });

    return res.status(201).json(novaFatura);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar fatura', error });
  }
};
