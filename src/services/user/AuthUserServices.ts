import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';

interface AuthRequest {
  credential: string; // pode ser email ou telefone
  password: string;
}

class AuthUserService {
  async execute({ credential, password }: AuthRequest) {
    // Encontrar o usuário pelo email ou telefone
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          { user_name: credential }, // busca por email
          { telefone: credential },
          ]
      }
    });

    // Verificar se o usuário existe
    if (!user) {
      throw new Error("Usuário ou senha incorretos");
    }

    if (user.status === false) { // Ou !user.status
      throw new Error("Conta desativada. Entre em contato com o suporte.");
    }
    const passwordMatch = await compare(password, user.password);
    // Se a senha for errada
    if (!passwordMatch) {
      throw new Error("Usuário ou senha incorretos");
    }

    // Gerar um token JWT
    const token = sign(
      {
        name: user.name,
        email: user.email,
        user_name:user.user_name
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '30d'
      }
    );

    return {
      id: user.id, // Aqui deve ser user.id em vez de user.email
      name: user.name,
      email: user.email,
      user_name:user.user_name,
      token: token,
      role: user.role,
    };
  }
}

export { AuthUserService };
