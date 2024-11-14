import { Request, Response } from "express";
import { ServicoService } from "../../services/servic/ServicoService"; // ajuste o caminho conforme necessário

class crudePedidoController {
  

  // Método para criar um novo serviço
  async create(req: Request, res: Response) {
    try {
      const { descricao, status, usuarioId, tipo } = req.body;
      const servicoService = new ServicoService();
      const servico = await servicoService.create({ descricao, status, usuarioId, tipo });
      return res.status(201).json(servico); // Retorna o serviço criado
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Método para listar todos os serviços
  async listAll(req: Request, res: Response) {
    try {
      const servicoService = new ServicoService();
      const servicos = await servicoService.listAll();
      return res.status(200).json(servicos); // Retorna todos os serviços
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar serviços" });
    }
  }

  // Método para listar serviços pendentes
  async listPending(req: Request, res: Response) {
    try {
      const servicoService = new ServicoService();
      const servicos = await servicoService.listPending();
      return res.status(200).json(servicos); // Retorna serviços pendentes
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar serviços pendentes" });
    }
  }

  // Método para listar serviços concluídos
  async listByIdUSerStatus(req: Request, res: Response) {
    const { IdUser,status } = req.params;
    try {
        
      const servicoService = new ServicoService();
      const servicos = await servicoService.listByUsuario(IdUser);
      return res.status(200).json(servicos); // Retorna serviços do user
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar serviços concluídos" });
    }
  }

  async listByIdUSer(req: Request, res: Response) {
    const { IdUser} = req.params;
    try {
         
      const servicoService = new ServicoService();
      const servicos = await servicoService.listByUsuario(IdUser);
      return res.status(200).json(servicos); // Retorna serviços do user
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar serviços concluídos" });
    }
  }

  // Método para listar serviços concluídos
  async listCompleted(req: Request, res: Response) {
    try {
      const servicoService = new ServicoService();
      const servicos = await servicoService.listCompleted();
      return res.status(200).json(servicos); // Retorna serviços concluídos
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar serviços concluídos" });
    }
  }

  // Método para atualizar o status de um serviço
  async updateStatus(req: Request, res: Response) {
    try {
      const { id, status } = req.body; 
      const servicoService = new ServicoService();
      const servico = await servicoService.updateStatus({ id, status });
      return res.status(200).json(servico); // Retorna o serviço atualizado
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { crudePedidoController }
