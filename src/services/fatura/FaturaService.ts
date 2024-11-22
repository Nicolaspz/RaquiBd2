import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { sendSmsToAdminFactu } from "../../utils/smsService";

const prisma = new PrismaClient();

export class FaturaService {
  // Verificar faturas com vencimento próximo e enviar SMS
  async verificarVencimento() {
    const hoje = moment().startOf("day");

    // Buscar faturas que vencem amanhã
    const faturas = await prisma.fatura.findMany({
      where: {
        status: "ABERTA",
        data_vencimento: hoje.add(1, "day").toDate(),
      },
    });

    // Iterar pelas faturas
    for (const fatura of faturas) {
      // Buscar o usuário associado ao `usuarioId` da fatura
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

      // Criar mensagem personalizada
      const mensagem = `Prezado(a) ${usuario.name}, sua fatura número ${fatura.numero} vencerá amanhã. Por favor, realize o pagamento para evitar atrasos.`;

      // Enviar SMS
      try {
        const smsSent = await sendSmsToAdminFactu({
          message: mensagem,
          userPhone: usuario.telefone, // Número de telefone do usuário
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
