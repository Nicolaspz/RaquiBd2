import { Request,Response } from "express";
import { CreateUserService } from "../../services/user/createUserService";

class CreateUserController{
  async hadle(req :Request, res: Response){
    //console.log(req.body);
    const {name,email,role,telefone,tipo_pagamento,nif,morada,user_name,redes}= req.body;
     const createUserService =new CreateUserService();
    const user= await createUserService.execute({
      name,email,role,tipo_pagamento,telefone,nif,morada,user_name,redes
    });
    return res.json(user);
  }
}
export {CreateUserController}