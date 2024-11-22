import { Request, Response } from "express";
import { InteracaoService } from "../../services/interacao/interacaoServices"; // Ajuste o caminho, se necessário

class InteracaoController {
  // Método para criar uma nova interação
  async create(req: Request, res: Response) {
    const { conteudo, autorId, servicoId, tipo } = req.body;
    const interacaoService = new InteracaoService();

    try {
      const interacao = await interacaoService.create({
        conteudo,
        autorId,
        servicoId,
        tipo,
      });

      // Verificar se a interação foi criada com sucesso
      if (interacao) {
        // Se a fatura foi criada ou vinculada com sucesso
        return res.status(201).json({
          message: "Interação criada com sucesso.",
          interacao,
        });
      }

      return res.status(400).json({
        message: "Erro ao criar interação. Fatura não associada corretamente.",
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Erro ao criar interação",
        message: error.message || "Ocorreu um erro desconhecido",
      });
    }
  }


  // Método para listar todas as interações de um serviço específico
  async listByServico(req: Request, res: Response) {
    const { servicoId } = req.params;
    const interacaoService = new InteracaoService();
    try {
      const interacoes = await interacaoService.listByServico(servicoId);
      return res.json(interacoes);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar interações", details: error });
    }
  }

  // Método para atualizar uma interação
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { conteudo } = req.body;
    const interacaoService = new InteracaoService();
    try {
      const interacao = await interacaoService.update(id, conteudo);
      return res.json(interacao);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar interação", details: error });
    }
  }

  // Método para excluir uma interação
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const interacaoService = new InteracaoService();
    try {
      await interacaoService.delete(id);
      return res.json({ message: "Interação excluída com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir interação", details: error });
    }
  }
}

export { InteracaoController };
