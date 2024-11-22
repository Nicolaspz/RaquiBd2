import { Request, Response } from "express";
import { FaturaService } from "../../services/fatura/FaturaService";

const faturaService = new FaturaService();

 class FaturaController {
  // Listar faturas com serviços e interações
  async listar(req: Request, res: Response) {
    try {
      const faturas = await faturaService.listarFaturasComServicosEInteracoes();
      return res.status(200).json(faturas);
    } catch (error) {
      console.error("Erro ao listar faturas:", error);
      return res.status(500).json({ message: "Erro ao listar faturas" });
    }
   }
  

  // Eliminar uma fatura
  async eliminar(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await faturaService.eliminarFatura(id);
      return res.status(200).json({ message: "Fatura eliminada com sucesso" });
    } catch (error) {
      console.error("Erro ao eliminar fatura:", error);
      return res.status(500).json({ message: "Erro ao eliminar fatura" });
    }
  }

  // Fechar uma fatura
  async fechar(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await faturaService.fecharFatura(id);
      return res.status(200).json({ message: "Fatura fechada com sucesso" });
    } catch (error) {
      console.error("Erro ao fechar fatura:", error);
      return res.status(500).json({ message: "Erro ao fechar fatura" });
    }
   }
   
   async executarVerificacao(req: Request, res: Response){
  try {
    await faturaService.verificarVencimento();
    return res.status(200).json({ message: "Verificação de vencimento concluída." });
  } catch (error) {
    console.error("Erro ao verificar vencimento:", error);
    return res.status(500).json({ message: "Erro ao executar verificação de vencimento." });
  }
   };
   
}
export {FaturaController}
