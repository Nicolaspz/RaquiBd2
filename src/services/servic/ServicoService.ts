import prismaClient from "../../prisma";
import {sendSmsPddo} from "../../utils/smsService"

interface CreateServicoRequest {
  descricao?: string; // Alterado para opcional, conforme o modelo
  status?: 'PENDENTE' | 'CONCLUIDO'; // Alinhado com o enum do Prisma
  usuarioId: string; // ID do usuário que cria o serviço
  tipo: 'SERVICO_ENTREGA' | 'SERVICO_PESSOAL' | 'SERVICO_24h' | 'SERVICO_30_DIAS';
  
}
/*
SERVICO_ENTREGA
  SERVICO_PESSOAL
  SERVICO_24h
  SERVICO_30_DIAS */

interface UpdateServicoRequest {
  id: string;
  status?: 'PENDENTE' | 'CONCLUIDO'; // Alinhado com o enum do Prisma
}


interface ServicoResponse {
  id: string;
  descricao?: string; // Alterado para opcional, conforme o modelo
  status: 'PENDENTE' | 'CONCLUIDO'; // Alinhado com o enum do Prisma
  usuarioId: string; // ID do usuário associado
  
}

class ServicoService {
  // Método para criar um novo serviço
  async create({ descricao, status, usuarioId, tipo }: CreateServicoRequest) {
  // Buscar o último número criado
  const ultimoServico = await prismaClient.servico.findFirst({
    orderBy: {
      numero: 'desc'
    },
    select: {
      numero: true
    }
  });

  const novoNumero = (ultimoServico?.numero ?? 0) + 1;

  const servico = await prismaClient.servico.create({
    data: {
      descricao,
      status,
      usuarioId,
      tipo,
      numero: novoNumero, // Novo campo aqui
    },
    select: {
      id: true,
      numero: true,
      descricao: true,
      status: true,
      usuarioId: true,
      tipo: true,
      faturaId: true,
      created_at: true,
      usuario: {
        select: {
          telefone: true
        }
      }
    }
  });

  if (servico) {
    const smsSent = await sendSmsPddo(servico.usuario.telefone);
    if (!smsSent) {
      console.log("Falha ao enviar SMS.");
    }
  }

  return { servico };
}


  // Método para listar todos os serviços
  async listAll() {
    const servicos = await prismaClient.servico.findMany({
     select: {
        id: true,
        descricao: true,
        status: true,
        usuarioId: true,
        tipo: true,
        numero:true,
        created_at: true,
        usuario: {
          select: {
            telefone:true,
            proces_number: true,
            tipo_pagamento:true
          }
        },
        Interacao: {  // Certifique-se de que o nome da relação está correto
        select: {
        id: true,
        conteudo: true,
        autorId: true,
        tipo: true,
        criado_em: true,
          },
          orderBy: {
      criado_em: 'asc',  // Ordena as interações pela data de criação, da mais recente para a mais antiga
    },
        },
      
      
      },
    });
    return  servicos ; // Retorna os serviços diretamente
  }

  // Método para listar serviços pendentes
  async listPending() {
    const servicos = await prismaClient.servico.findMany({
      where: {
        status: 'PENDENTE',
      },
      select: { // Seleciona os campos que deseja retornar
        id: true,
        descricao: true,
        status: true,
        usuarioId: true,
        tipo: true,
        numero:true,
      },
    });
    return { servicos }; // Retorna os serviços pendentes diretamente
  }

  // Método para listar serviços concluídos
  async listCompleted() {
    const servicos = await prismaClient.servico.findMany({
      where: {
        status: 'CONCLUIDO',
      },
      select: { // Seleciona os campos que deseja retornar
        id: true,
        descricao: true,
        status: true,
        usuarioId: true,
        tipo: true,
        numero: true,
      },
    });
    return servicos; // Retorna os serviços concluídos diretamente
  }

  // Método para atualizar o status de um serviço
  async updateStatus({ id, status }: UpdateServicoRequest) {
    const servico = await prismaClient.servico.update({
      where: {
        id,
      },
      data: {
        status,
      },
      select: { // Seleciona os campos que deseja retornar
        id: true,
        descricao: true,
        status: true,
        usuarioId: true,
      },
    });

    return servico; // Retorna o serviço atualizado diretamente
  }

  //ArchivePedido
  async archiveServico(id: string) {
  // 1. Buscar o serviço e sua fatura associada (caso exista)
  const servico = await prismaClient.servico.findUnique({
    where: { id },
    include: {
      Fatura: true, // Pegamos a fatura diretamente
    },
  });
    console.log("serviço", servico);
  if (!servico) {
    throw new Error("Serviço não encontrado");
  }

  const faturaId = servico.faturaId;
    console.log("Factura", faturaId);

  // 2. Se estiver vinculado a uma fatura, desvincular e verificar a fatura
  if (faturaId) {
    // Remover vínculo do serviço com a fatura
    await prismaClient.servico.update({
      where: { id },
      data: {
        faturaId: null, // Remove a associação com a fatura
      },
    });

    // Verificar se a fatura ainda tem serviços
    const fatura = await prismaClient.fatura.findUnique({
      where: { id: faturaId },
      include: {
        servicos: true,
      },
    });

    if (fatura && fatura.servicos.length === 0) {
      // Se não houver mais serviços, marcar como CANCELADA
      await prismaClient.fatura.update({
        where: { id: faturaId },
        data: {
          status: "CANCELADA",
        },
      });
    }
  }

  // 3. Atualizar status do serviço para ARQUIVADO
  const servicoAtualizado = await prismaClient.servico.update({
    where: { id },
    data: {
      status: "ARQUIVADA",
    },
    select: {
      id: true,
      descricao: true,
      status: true,
      usuarioId: true,
    },
  });

  return servicoAtualizado;
  }
  
  async reabrirServicoEAssociarAFatura(servicoId: string) {
  // Buscar o serviço
  const servico = await prismaClient.servico.findUnique({
    where: { id: servicoId },
    include: {
      Fatura: true,
    },
  });
    console.log("pedido", servico);
  if (!servico) throw new Error("Serviço não encontrado.");

  // Buscar o usuário dono do serviço
  const usuario = await prismaClient.user.findUnique({
    where: { id: servico.usuarioId },
  });

  if (!usuario) throw new Error("Usuário relacionado ao serviço não encontrado.");

  let faturaAberta = null;

  // Se for do tipo especial (24h ou 30 dias), cria fatura exclusiva
  if (servico.tipo === "SERVICO_24h" || servico.tipo === "SERVICO_30_DIAS") {
    const numeroFatura = this.gerarNumeroFatura(); // Gere como achar melhor
    const dataVencimento = new Date(); // Agora
    dataVencimento.setDate(dataVencimento.getDate() + 1); // +1 dia

    faturaAberta = await prismaClient.fatura.create({
      data: {
        numero: numeroFatura,
        usuarioId: servico.usuarioId,
        data_vencimento: dataVencimento,
        status: 'ABERTA',
        servicos: {
          connect: { id: servico.id },
        },
      },
    });
  } else {
    // Buscar fatura aberta do mesmo usuário (sem tipos exclusivos)
    faturaAberta = await prismaClient.fatura.findFirst({
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
      const numeroFatura = this.gerarNumeroFatura();
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 1); // +1 dia

      faturaAberta = await prismaClient.fatura.create({
        data: {
          numero: numeroFatura,
          usuarioId: servico.usuarioId,
          data_vencimento: dataVencimento,
          status: 'ABERTA',
          servicos: {
            connect: { id: servico.id },
          },
        },
      });
    } else {
      // Associar à fatura aberta existente
      await prismaClient.servico.update({
        where: { id: servico.id },
        data: { faturaId: faturaAberta.id },
      });
    }
  }


  // Reabrir o serviço (status = ABERTA)
  const servicoAtualizado = await prismaClient.servico.update({
    where: { id: servico.id },
    data: {
      status: "PENDENTE",
      faturaId: faturaAberta?.id,
    },
  });

  return servicoAtualizado;
  }
  
  private gerarNumeroFatura(): string {
  const dataPrefixo = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Ex: 20241129
  const numeroAleatorio = Math.floor(10 + Math.random() * 90); // Garante 2 dígitos aleatórios
  return `FO-${dataPrefixo}${numeroAleatorio}`;
  }


  async listByUsuario(usuarioId: string) {
    
    const servicos = await prismaClient.servico.findMany({
      where: {
        usuarioId,
      },
      select:{
        id: true,
        descricao: true,
        status: true,
        usuarioId: true,
        tipo: true,
        numero:true,
        created_at: true,
        usuario: {
          select: {
            proces_number: true,
            tipo_pagamento:true
          }
        },
        Interacao: {  // Certifique-se de que o nome da relação está correto
        select: {
        id: true,
        conteudo: true,
        autorId: true,
        tipo: true,
        criado_em: true,
          },
          orderBy: {
      criado_em: 'desc',  // Ordena as interações pela data de criação, da mais recente para a mais antiga
    },
    },
      },
    });
    return servicos;
  }
  async delete(id: string) {
    await prismaClient.servico.delete({ where: { id } });
  }
}

export { ServicoService };
