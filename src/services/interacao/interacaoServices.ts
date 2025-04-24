import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { sendSmsToAdminFactu } from '../../utils/smsService'
import prismaClient from "../../prisma";

const prisma = new PrismaClient();

interface InteracaoData {
  conteudo: string;
  autorId: string;
  servicoId: string;
  tipo: string;
}

export class InteracaoService {
    async create({ conteudo, autorId, servicoId, tipo }: InteracaoData) {
  // Buscar o serviço com interações e fatura
  const servico = await prisma.servico.findUnique({
    where: { id: servicoId },
    include: {
      Interacao: true,
      Fatura: true
    },
  });

  if (!servico) throw new Error("Serviço não encontrado.");

  // Buscar usuário relacionado ao serviço
  const usuario = await prisma.user.findUnique({
    where: { id: servico.usuarioId },
  });

  if (!usuario) throw new Error("Usuário relacionado ao serviço não encontrado.");

  // 👉 Verificar se é a primeira interação
  if (servico.Interacao.length === 0) {
    let faturaAberta = null;

    if (servico.tipo === "SERVICO_24h" || servico.tipo === "SERVICO_30_DIAS") {
      const numeroFatura = await this.gerarNumeroFatura();
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
        const numeroFatura = await this.gerarNumeroFatura();
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
        await prisma.servico.update({
          where: { id: servicoId },
          data: { faturaId: faturaAberta.id },
        });
      }
    }
  }

  // Criar a interação
  const interacao = await prisma.interacao.create({
    data: { conteudo, autorId, servicoId, tipo },
    include: {
      autor: true,
      servico: { include: { usuario: true } }
    }
  });

  // Enviar notificação
  const isAdmin = interacao.autor.role === 'ADMIN';
  const destino = isAdmin ? usuario.telefone : "938654617";
  const mensagem = isAdmin
    ? `Atualização do pedido ${servico.numero} : ${interacao.conteudo}`
    : `Novo comentário de ${interacao.autor.name}: ${interacao.conteudo}`;

  try {
    const smsSent = await sendSmsToAdminFactu({
      message: mensagem,
      userPhone: destino,
    });

    if (!smsSent) console.log("Erro ao enviar SMS");
  } catch (error) {
    console.error("Erro no envio de SMS:", error);
  }

  return interacao;
}


// Gerar número de fatura (método auxiliar)
async gerarNumeroFatura(): Promise<string> {
  // Buscar a última fatura registrada no banco de dados
  const ultimaFatura = await prismaClient.fatura.findFirst({
    orderBy: {
      numero: 'desc', // Ordena pela maior fatura
    },
    select: {
      numero: true, // Pega só o número da fatura
    },
  });

  // Se não houver faturas, retorna FO0001 como o primeiro número
  if (!ultimaFatura) {
    return 'FO1';
  }

  // Extrair o número da fatura (removendo o prefixo 'FO')
 const ultimoNumero = parseInt(ultimaFatura.numero.replace('FO', ''), 10);

  // Incrementar o número
  const novoNumero = ultimoNumero + 1;

  // Formatar o número com 4 dígitos, com 0 à esquerda se necessário
  

  // Retornar o novo número de fatura com o prefixo 'FO'
  return `FO${novoNumero}`;
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
      CONTA_24H: 1,
    };
    return moment().add(dias[tipoPagamento] || 7, "days").toDate();
  }
}
