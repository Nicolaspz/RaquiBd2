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


// Inicia o servidor na porta especificada
const PORT = process.env.PORT || 3333;
server.listen(PORT, () =>
  console.log(`Servidor online na porta ${PORT}`)
);
