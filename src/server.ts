import express, { Request, NextFunction, Response } from "express";
import "express-async-errors";
import { router } from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // Para criar o servidor HTTP
import { Server } from "socket.io"; // Socket.IO


dotenv.config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:8081", "https://raqui.vercel.app", "http://localhost:3000","https://rdb-admin-web.vercel.app","https://rdb-admin-gcvconaon-nicolas-domingos-projects.vercel.app","https://rdb-admin-web-git-main-nicolas-domingos-projects.vercel.app"], // Lista de origens permitidas
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  credentials: true, // Permite envio de cookies e cabeçalhos de autenticação
};
// Cria o servidor HTTP
const server = http.createServer(app);



app.use(express.json());
app.use(cors(corsOptions));
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
