import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { sendSmsToAdminFactu } from "../../utils/smsService";

const prisma = new PrismaClient();

export class FaturaService {
  // Listar faturas com seus serviços e interações
  async listarFaturasComServicosEInteracoes() {
    return await prisma.fatura.findMany({
      include: {
        servicos: {
          include: {
            Interacao: true, // Inclui as interações relacionadas a cada serviço
          },
        },
      },
    });
  }

  // Eliminar fatura pelo ID
  async eliminarFatura(faturaId: string) {
    return await prisma.fatura.delete({
      where: { id: faturaId },
    });
  }

  // Fechar fatura pelo ID
  async fecharFatura(faturaId: string) {
    return await prisma.fatura.update({
      where: { id: faturaId },
      data: { status: "PAGA" },
    });
  }

  // Verificar vencimento das faturas e enviar SMS
  async verificarVencimento() {
    const hoje = moment().startOf("day");

    const faturas = await prisma.fatura.findMany({
      where: {
        status: "ABERTA",
        data_vencimento: hoje.add(1, "day").toDate(),
      },
    });

    for (const fatura of faturas) {
      const usuario = await prisma.user.findUnique({
        where: { id: fatura.usuarioId },
      });

      if (!usuario) {
        console.error(`Usuário com ID ${fatura.usuarioId} não encontrado para a fatura ${fatura.numero}.`);
        continue;
      }

      if (!usuario.telefone) {
        console.error(`Usuário ${usuario.name} não possui número de telefone cadastrado.`);
        continue;
      }

      const mensagem = `Prezado(a) ${usuario.name}, sua fatura número ${fatura.numero} vencerá amanhã. Por favor, realize o pagamento para evitar atrasos.`;

      try {
        const smsSent = await sendSmsToAdminFactu({
          message: mensagem,
          userPhone: usuario.telefone,
        });

        if (!smsSent) {
          console.error(`Falha ao enviar SMS para o usuário ${usuario.name}.`);
          continue;
        }

        console.log(`SMS enviado com sucesso para o usuário ${usuario.name}`);
      } catch (error) {
        console.error(`Erro ao enviar SMS para o usuário ${usuario.name}:`, error);
      }
    }
  }
}
