import express, { Request, NextFunction, Response } from "express";
import "express-async-errors";
import { router } from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // Para criar o servidor HTTP
import { Server } from "socket.io"; // Socket.IO

dotenv.config();

const app = express();

// Cria o servidor HTTP
const server = http.createServer(app);

// Configura o Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Substitua pelo domínio do front-end em produção
    methods: ["GET", "POST"],
  },
});

// Simulação de armazenamento de faturas em memória
let faturas: any[] = [];

app.use(express.json());
app.use(cors());
app.use(router);

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    status: "Error",
    message: "Internal Error.",
  });
});

// Eventos de conexão com Socket.IO
io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Envia a lista atualizada de faturas para o cliente ao conectar
  socket.emit("updateFront", faturas);

  // Evento para criar uma nova fatura
  socket.on("newFatura", (fatura) => {
    console.log("Nova fatura recebida:", fatura);

    // Adiciona a nova fatura ao "banco de dados"
    faturas.push(fatura);

    // Emite todas as faturas atualizadas para os clientes conectados
    io.emit("updateFront", faturas);
  });

  // Evento para atualizar uma fatura existente
  socket.on("updateFatura", (updatedFatura) => {
    console.log("Fatura atualizada:", updatedFatura);

    // Atualiza a fatura no "banco de dados"
    faturas = faturas.map((fatura) =>
      fatura.id === updatedFatura.id ? { ...fatura, ...updatedFatura } : fatura
    );

    // Emite todas as faturas atualizadas para os clientes conectados
    io.emit("updateFront", faturas);
  });

  // Evento de desconexão do cliente
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicia o servidor na porta especificada
const PORT = process.env.PORT || 3333;
server.listen(PORT, () =>
  console.log(`Servidor online na porta ${PORT}`)
);
