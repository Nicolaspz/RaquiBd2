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
        usuario: {
          select: {
            name: true,
            proces_number: true,
            tipo_pagamento:true
          }
        }
      },
    });
  }

  async listarFaturasComServicosEInteracoesById(usuarioId: string) {
    return await prisma.fatura.findMany({
      where: {
        usuarioId,
      },
      include: {
      
        servicos: {
          
          include: {
            Interacao: true, // Inclui as interações relacionadas a cada serviço
          },
        },
        usuario: {
          select: {
            name: true,
            proces_number: true,
            tipo_pagamento:true
          }
        }
      },
    });
  }

  // Eliminar fatura pelo ID
  async eliminarFatura(faturaId: string) {
    return await prisma.fatura.delete({
      where: { id: faturaId },
    });
  }

  //create factura
  /*async createFatura(numero:string,usuarioId:string,data_vencimento:string,servicos:string) {
    await prisma.fatura.create({
      data: {
          numero: numero,
          usuarioId: usuarioId,
          data_vencimento: data_vencimento,
          servicos: servicos,
        },
      
    });
   }*/

  // Fechar fatura pelo ID
  async PagarFatura(faturaId: string) {
    return await prisma.fatura.update({
      where: { id: faturaId },
      data: { status: "PAGA" },
    });
  }

  async FecharFatura(faturaId: string) {
    return await prisma.fatura.update({
      where: { id: faturaId },
      data: {
        status: "FECHADA"
      },
    });
  }

  // Verificar vencimento das faturas e enviar SMS

  // Armazenar logs
 

  async verificarVencimento() {
     const logs: string[] = [];
  const hoje = moment().startOf("day"); // Zera a parte da hora para hoje começar à meia-noite
  const amanha = moment().add(1, "day").startOf("day"); // A mesma coisa para amanhã
  
  // Adicionando log de início
  logs.push("Iniciando verificação de vencimento.");

  const faturas = await prisma.fatura.findMany({
    where: {
      status: "ABERTA",
      data_vencimento: {
        gte: amanha.toDate(), // maior ou igual a amanhã, começando à meia-noite
        lt: amanha.add(1, "day").toDate(), // e menor que o próximo dia (meia-noite do dia seguinte)
      },
    },
  });

  if (faturas.length === 0) {
    logs.push("Nenhuma fatura a vencer amanhã.");
    return logs;
  }

  // Se houver faturas, prossiga
  for (const fatura of faturas) {
    const usuario = await prisma.user.findUnique({
      where: { id: fatura.usuarioId },
    });

    if (!usuario) {
      logs.push(`Usuário com ID ${fatura.usuarioId} não encontrado para a fatura ${fatura.numero}.`);
      continue;
    }

    if (!usuario.telefone) {
      logs.push(`Usuário ${usuario.name} não possui número de telefone cadastrado.`);
      continue;
    }

    const mensagem = `Prezado(a) ${usuario.name}, sua fatura número ${fatura.numero} vencerá amanhã. Por favor, realize o pagamento para evitar atrasos.`;

    try {
      const smsSent = await sendSmsToAdminFactu({
        message: mensagem,
        userPhone: usuario.telefone,
      });

      if (!smsSent) {
        logs.push(`Falha ao enviar SMS para o usuário ${usuario.name}.`);
        continue;
      }

      logs.push(`SMS enviado com sucesso para o usuário ${usuario.name}`);
    } catch (error) {
      logs.push(`Erro ao enviar SMS para o usuário ${usuario.name}: ${error}`);
    }
  }

  return logs;  // Retorna os logs ao controlador
}

}



