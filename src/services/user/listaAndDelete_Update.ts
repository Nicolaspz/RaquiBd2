import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

class UserServices {
 
  

  async UserById(id) {
    // Implementação da listagem de usuários de uma organização específica
    return prisma.user.findFirst({
      where: {id},
      
    });
  }

  async listAllUsers() {
    // Implementação da listagem de usuários de uma organização específica
    return prisma.user.findMany();
  }

  async updateUser({ userId, name, email, role, password, telefone, user_name }) {
    const dataToUpdate: any = {}; // Criamos um objeto vazio

    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (role !== undefined) dataToUpdate.role = role;
    if (password !== undefined) dataToUpdate.password = await hash(password, 8);
    if (password !== undefined) dataToUpdate.autoPass = password;
    if (telefone !== undefined) dataToUpdate.telefone = telefone;
    if (user_name !== undefined) dataToUpdate.user_name = user_name;

    return prisma.user.update({
        where: { id: userId },
        data: dataToUpdate, // Enviamos apenas os campos preenchidos
    });
}


  async deleteUser(userId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se o usuário está associado a alguma serviço
    const ordersCount = await prisma.servico.count({
      where: {id: userId },
    });

    if (ordersCount > 0) {
      throw new Error("Usuário associado a pedidos. Não pode ser excluído.");
    }

  
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}

export { UserServices };