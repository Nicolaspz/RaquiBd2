import { Request,Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";
class DetailUserController{
  async handle(req:Request, res:Response){
    const id_user = req.user_id;
    const detailUser= new DetailUserService();
    const detail= await detailUser.execute(id_user);
    return res.json(detail); 
  }

}
export {DetailUserController}