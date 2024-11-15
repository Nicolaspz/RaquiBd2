import express, {Request, NextFunction, Response } from "express";
import 'express-async-errors';
import { router } from "./routes";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



const app=express();



app.use(express.json());

app.use(cors());
app.use(router);

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