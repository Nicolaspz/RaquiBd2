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
  // Método para criar uma interação
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
 /* try {
    const smsSent = await sendSmsToAdminFactu({
      message: mensagem,
      userPhone: usuario.telefone,
    });

    if (!smsSent) {
      console.log(`Falha ao enviar SMS para o usuário ${usuario.name}.`);
    }
  } catch (error) {
    console.error(`Erro ao enviar SMS para o usuário ${usuario.name}:`, error);
  }
*/
  // Lógica para criação de fatura
  let faturaAberta = null;

  if (servico.tipo === "SERVICO_24h" || servico.tipo === "SERVICO_30_DIAS") {
    let dataVencimento: Date;
    // Obter ano, mês e dia no formato YYYYMMDD
    const dataPrefixo = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Ex: 20241129
    const numeroAleatorio = Math.floor(10 + Math.random() * 90); // Garante 2 dígitos aleatórios
    const numeroFatura = `FAT-${dataPrefixo}${numeroAleatorio}`;

  // Para SERVICO_24h, somar 24 horas à data atual
  if (servico.tipo === "SERVICO_24h") {
    dataVencimento = new Date();
    dataVencimento.setHours(dataVencimento.getHours() + 24);  // Adiciona 24 horas
  }

  // Para SERVICO_30_DIAS, somar 3 dias à data atual
  if (servico.tipo === "SERVICO_30_DIAS") {
    dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + 3);  // Adiciona 3 dias
  }

  faturaAberta = await prisma.fatura.create({
    data: {
      numero: numeroFatura,
      usuarioId: servico.usuarioId,
      data_vencimento: dataVencimento,
      servicos: { connect: { id: servicoId } },
    },
  });
  } else {
    // Para os outros tipos de serviço, verificar se existe fatura aberta
    faturaAberta = await prisma.fatura.findFirst({
      where: {
        usuarioId: servico.usuarioId,
        status: "ABERTA",
      },
    });

    if (!faturaAberta) {
      // Criar nova fatura caso não exista nenhuma aberta
      const dataPrefixo = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Ex: 20241129
      const numeroAleatorio = Math.floor(10 + Math.random() * 90); // Garante 2 dígitos aleatórios
      const numeroFatura = `FAT-${dataPrefixo}${numeroAleatorio}`;
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
