import prismaClient from "../../prisma";

interface CreateInteracaoRequest {
  conteudo: string;
  autorId: string; // ID do autor da interação
  servicoId: string; // ID do serviço ao qual pertence a interação
  tipo: string // Enum ou string para tipo de interação
}

interface InteracaoResponse {
  id: string;
  conteudo: string;
  autorId: string;
  servicoId: string;
  criado_em: Date;
  tipo: string;
}

class InteracaoService {
  // Método para criar uma nova interação
  async create({ conteudo, autorId, servicoId, tipo }: CreateInteracaoRequest){
    const interacao = await prismaClient.interacao.create({
      data: {
        conteudo,
        autorId,
        servicoId,
        tipo,
      },
      select: { // Seleciona os campos que deseja retornar
        id: true,
        conteudo: true,
        autorId: true,
        servicoId: true,
        criado_em: true,
        tipo: true,
      },
    });
    return interacao;
  }

  // Método para listar todas as interações de um serviço específico
  async listByServico(servicoId: string){
    const interacoes = await prismaClient.interacao.findMany({
      where: {
        servicoId,
      },
      select: {
        id: true,
        conteudo: true,
        autorId: true,
        servicoId: true,
        criado_em: true,
        tipo: true,
      },
    });
    return interacoes;
  }

  async update(id: string, conteudo: string){
    const interacao = await prismaClient.interacao.update({
      where: { id },
      data: {conteudo},
      select: { id: true, conteudo: true, autorId: true, servicoId: true, criado_em: true, tipo: true },
    });
    return interacao;
  }

  // Método para excluir uma interação
  async delete(id: string) {
    await prismaClient.interacao.delete({
      where: { id },
    });
  }

}

export { InteracaoService };