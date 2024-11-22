import cron from "node-cron";
import { FaturaService } from "../services/fatura/FaturaService";

const faturaService = new FaturaService();

export const scheduleTasks = () => {
  // Agendar o cron job para rodar todos os dias à meia-noite
  cron.schedule("* * * * *", async () => {
    console.log("Iniciando verificação de vencimento...");
    try {
      await faturaService.verificarVencimento();
      console.log("Verificação de vencimento concluída com sucesso.");
    } catch (error) {
      console.error("Erro ao executar a verificação de vencimento:", error);
    }
  });

  console.log("Cron jobs configurados com sucesso.");
};
