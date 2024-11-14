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

  async updateUser({ userId, name, email, role, password}) {
    // Verifica se o usuário existe antes de atualizá-lo
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const passwordHas= await hash(password,8)
    return prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        password:passwordHas,
       
      },
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