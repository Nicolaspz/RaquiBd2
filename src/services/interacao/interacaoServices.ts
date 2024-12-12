import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { sendSmsToAdminFactu } from '../../utils/smsService'

const prisma = new PrismaClient();

interface InteracaoData {
  conteudo: string;
  autorId: string;
  servicoId: string;
  tipo: string;
}

export class InteracaoService {
 async create({ conteudo, autorId, servicoId, tipo }: InteracaoData) {
  // Verificar se o serviço já possui interações
  const servico = await prisma.servico.findUnique({
    where: { id: servicoId },
    include: { Interacao: true, Fatura: true },
  });

  if (!servico) throw new Error("Serviço não encontrado.");

  // Caso já tenha interações, apenas adicionar a interação
  if (servico.Interacao.length > 0) {
    return prisma.interacao.create({
      data: { conteudo, autorId, servicoId, tipo },
    });
  }

  // Enviar notificação SMS para o usuário relacionado ao serviço
  const usuario = await prisma.user.findUnique({
    where: { id: servico.usuarioId },
  });
  if (!usuario) throw new Error("Usuário relacionado ao serviço não encontrado.");

   const mensagem = `Prezado(a) ${usuario.name}, a sua solicitação foi aceite. Abra o App para mais detalhes. Obrigado!`;
   try {
      const smsSent = await sendSmsToAdminFactu({
        message: mensagem,
        userPhone: usuario.telefone,
      });

      if (!smsSent) {
        console.log("Erro")
      }

      
    } catch (error) {
     
    }

  // Lógica para criação de fatura
  let faturaAberta = null;

  if (servico.tipo === "SERVICO_24h" || servico.tipo === "SERVICO_30_DIAS") {
    // Sempre criar uma nova fatura para esses tipos de serviço
    const numeroFatura = this.gerarNumeroFatura();
    const dataVencimento = this.calcularVencimentoPorTipo(servico.tipo);
    
    faturaAberta = await prisma.fatura.create({
      data: {
        numero: numeroFatura,
        usuarioId: servico.usuarioId,
        data_vencimento: dataVencimento,
        servicos: { connect: { id: servicoId } },
      },
    });
  } else {
    // Para outros serviços, verificar se existe fatura aberta
    faturaAberta = await prisma.fatura.findFirst({
      where: {
        usuarioId: servico.usuarioId,
        status: "ABERTA",
        servicos: {
          none: {
            tipo: { in: ["SERVICO_24h", "SERVICO_30_DIAS"] },
          },
        },
      },
    });

    if (!faturaAberta) {
      // Criar nova fatura caso não exista nenhuma aberta ou se a aberta for do tipo 24h ou 30 dias
      const numeroFatura = this.gerarNumeroFatura();
      const dataVencimento = this.calcularVencimento(usuario.tipo_pagamento);
      faturaAberta = await prisma.fatura.create({
        data: {
          numero: numeroFatura,
          usuarioId: servico.usuarioId,
          data_vencimento: dataVencimento,
          servicos: { connect: { id: servicoId } },
        },
      });
    } else {
      // Vincular o serviço à fatura existente
      await prisma.servico.update({
        where: { id: servicoId },
        data: { faturaId: faturaAberta.id },
      });
    }
  }

  // Criar a interação
  return prisma.interacao.create({
    data: { conteudo, autorId, servicoId, tipo },
  });
}

// Gerar número de fatura (método auxiliar)
private gerarNumeroFatura(): string {
  const dataPrefixo = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Ex: 20241129
  const numeroAleatorio = Math.floor(10 + Math.random() * 90); // Garante 2 dígitos aleatórios
  return `FAT-${dataPrefixo}${numeroAleatorio}`;
}

// Calcular vencimento por tipo de serviço (método auxiliar)
private calcularVencimentoPorTipo(tipo: string): Date {
  const dataVencimento = new Date();
  if (tipo === "SERVICO_24h") {
    dataVencimento.setHours(dataVencimento.getHours() + 24);
  } else if (tipo === "SERVICO_30_DIAS") {
    dataVencimento.setDate(dataVencimento.getDate() + 3);
  }
  return dataVencimento;
}



  // Método para listar interações de um serviço
  async listByServico(servicoId: string) {
    return prisma.interacao.findMany({
      where: { servicoId },
      orderBy: { criado_em: "asc" },
    });
  }

  // Método para atualizar uma interação
  async update(id: string, conteudo: string) {
    return prisma.interacao.update({
      where: { id },
      data: { conteudo },
    });
  }

  // Método para excluir uma interação
  async delete(id: string) {
    await prisma.interacao.delete({ where: { id } });
  }

  // Função para calcular vencimento da fatura
  private calcularVencimento(tipoPagamento: string): Date {
    const dias = {
      CONTA_3DIAS: 3,
      CONTA_7DIAS: 7,
      CONTA_15DIAS: 15,
      CONTA_30DIAS: 30,
    };
    return moment().add(dias[tipoPagamento] || 7, "days").toDate();
  }
}
