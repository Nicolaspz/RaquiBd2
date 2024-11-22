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

  // Armazenar logs
  private logs: string[] = [];

  async verificarVencimento() {
    const hoje = moment().startOf("day");

    // Adicionando um log de início
    this.logs.push("Iniciando verificação de vencimento.");

    const faturas = await prisma.fatura.findMany({
      where: {
        status: "ABERTA",
        data_vencimento: hoje.add(1, "day").toDate(),
      },
    });

    if (faturas.length === 0) {
      this.logs.push("Nenhuma fatura a vencer amanhã.");
      return this.logs;  // Retornar os logs ao controlador
    }

    for (const fatura of faturas) {
      const usuario = await prisma.user.findUnique({
        where: { id: fatura.usuarioId },
      });

      if (!usuario) {
        this.logs.push(`Usuário com ID ${fatura.usuarioId} não encontrado para a fatura ${fatura.numero}.`);
        continue;
      }

      if (!usuario.telefone) {
        this.logs.push(`Usuário ${usuario.name} não possui número de telefone cadastrado.`);
        continue;
      }

      const mensagem = `Prezado(a) ${usuario.name}, sua fatura número ${fatura.numero} vencerá amanhã. Por favor, realize o pagamento para evitar atrasos.`;

      try {
        const smsSent = await sendSmsToAdminFactu({
          message: mensagem,
          userPhone: usuario.telefone,
        });

        if (!smsSent) {
          this.logs.push(`Falha ao enviar SMS para o usuário ${usuario.name}.`);
          continue;
        }

        this.logs.push(`SMS enviado com sucesso para o usuário ${usuario.name}`);
      } catch (error) {
        this.logs.push(`Erro ao enviar SMS para o usuário ${usuario.name}: ${error}`);
      }
    }

    return this.logs;  // Retornar os logs ao controlador
  }
}



