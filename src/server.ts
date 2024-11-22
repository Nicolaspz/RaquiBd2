import express, { Request, NextFunction, Response } from "express";
import 'express-async-errors';
import { router } from "./routes";
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // Para criar o servidor HTTP
import { Server } from 'socket.io'; // Socket.IO


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
    status: 'Error',
    message: 'Internal Error.',
  });
});

// Eventos de conexão com Socket.IO
io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Evento para pedidos criados
  socket.on("newOrder", (order) => {
    console.log("Novo pedido recebido:", order);
    // Emite o novo pedido para todos os clientes conectados
    io.emit("newOrder", order);
  });

  // Evento para atualizar pedidos
  socket.on("updateOrder", (updatedOrder) => {
    console.log("Pedido atualizado:", updatedOrder);
    // Emite o pedido atualizado para todos os clientes conectados
    io.emit("updateOrder", updatedOrder);
  });

  // Desconexão do cliente
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicia o servidor na porta especificada
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => console.log(`Servidor online na porta ${PORT}`));
