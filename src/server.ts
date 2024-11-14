import express, {Request, NextFunction, Response } from "express";
import 'express-async-errors';
import { router } from "./routes";
import cors from 'cors';
import path from 'path';
import http from 'http';
import prismaClient from './prisma';
import { Server } from 'socket.io';

const app=express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

app.use(cors());
app.use(router);
//costumizamos caminho estático para pegar as imagens
/*app.use(
  ['/files', '/tmp'],
  express.static(path.resolve(__dirname, '..', 'tmp'))
);*/
// Quando um cliente conecta ao WebSocket
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Serviço de Interação
import { InteracaoService } from './services/interacao/interacaoServices';

class InteracaoController {
  async create(req, res) {
    const { conteudo, autorId, servicoId, tipo } = req.body;
    const interacaoService = new InteracaoService();
    try {
      const interacao = await interacaoService.create({ conteudo, autorId, servicoId, tipo });

      // Envia a nova interação para todos os clientes conectados
      io.emit('nova_interacao', interacao);

      return res.json(interacao);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar interação", details: error.message });
    }
  }
}

app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{

  if(err instanceof Error){
    return res.status(400).json({
      error:err.message
    })
  }
  return res.status(500).json({
    status:'Error',
    message:'Internal Error.'
  })
})
app.listen(process.env.PORT,()=> console.log("servidor online na porta 3333")); 