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
  async updatePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user_id;
       const createUserService =new CreateUserService();
      const result = await createUserService.updatePassword(userId, oldPassword, newPassword);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
export {CreateUserController}