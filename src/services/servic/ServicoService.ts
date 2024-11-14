import prismaClient from "../../prisma";

interface CreateServicoRequest {
  descricao?: string; // Alterado para opcional, conforme o modelo
  status?: 'PENDENTE' | 'CONCLUIDO'; // Alinhado com o enum do Prisma
  usuarioId: string; // ID do usuário que cria o serviço
  tipo: 'ENTREGA' | 'MOTORISTA_PESSOAL';
}

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
    
    const servico = await prismaClient.servico.create({
      data: {
        descricao, // Campo opcional, pode ser undefined
        status,
        usuarioId,
        tipo
      } ,//as Prisma.ServicoUncheckedCreateInput,
      select: { // Aqui você pode selecionar os campos que deseja retornar
        id: true,
        descricao: true,
        status: true,
        usuarioId: true,
        tipo: true,
        created_at:true,
        
      },
    });
    console.log(servico);

    return { servico }; // Retorna o serviço diretamente
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
        created_at:true,
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
        tipo:true
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
        tipo:true
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
        created_at:true,
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
}

export { ServicoService };
