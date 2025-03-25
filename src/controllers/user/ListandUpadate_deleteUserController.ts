import { Request, Response } from "express";
import { UserServices } from "../../services/user/listaAndDelete_Update";

class UserController {
  

  /*async listUsers(req: Request, res: Response) {
   
    const userService = new UserServices();
    const users = await userService.listUsers();
    return res.json(users);
  }*/
  async listAllUsers(req: Request, res: Response) {
    const userService = new UserServices();
    const users = await userService.listAllUsers();
    return res.json(users);
  }

  async UserById(req: Request, res: Response) {
    const {id} =req.query;
    const userService = new UserServices();
    const users = await userService.UserById(id);
    return res.json(users);
  }

  async updateUser(req: Request, res: Response) {
    const { userId } = req.query;
    const userService = new UserServices();

    // Filtrando apenas os campos que foram enviados
    const updateData: any = {};
    const { name, email, role, password, telefone, user_name,tipo_pagamento  } = req.body;

    if (name?.trim()) updateData.name = name;
    if (email?.trim()) updateData.email = email;
    if (role?.trim()) updateData.role = role;
    if (password?.trim()) updateData.password = password;
    if (telefone?.trim()) updateData.telefone = telefone;
    if (user_name?.trim()) updateData.user_name = user_name;
    if (tipo_pagamento?.trim()) updateData.tipo_pagamento = tipo_pagamento;

    // Verifica se há algo para atualizar
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Nenhum campo para atualizar" });
    }

    try {
        const updatedUser = await userService.updateUser({ userId, ...updateData });
        return res.json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar usuário", error: error.message });
    }
}

  async deleteUser(req: Request, res: Response) {
    const { userId } = req.query;
    const userService = new UserServices();
    await userService.deleteUser(userId);
    return res.json({ message: "User deleted successfully" });
  }
}

export { UserController };
