import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
import { sendSmsToAdmin } from '../../utils/smsService'


interface UserRequest {
  name: string;
  email: string;
  tipo_pagamento: 'CONTA_3DIAS'| 'CONTA_30DIAS' | 'CONTA_7DIAS' | 'CONTA_15DIAS';
  telefone: string;
  role: 'ADMIN' | 'CLIENT';
  nif: string;
  morada: string;
  user_name: string;
  redes: string;
  
}

function generateRandomPassword(length = 10) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

class CreateUserService {
  async execute({ name, email, role, tipo_pagamento, telefone,nif,morada,user_name,redes }: UserRequest) {
  // Verifique se enviou email
  if (!email) {
    throw new Error("Email incorreto");
  }

  // Verifique se enviou telefone
  if (!telefone) {
    throw new Error("Telefone incorreto");
  }
  if (!user_name) {
    throw new Error("Username incorreto");
  }

  // Verificar se o email já está cadastrado na plataforma
  const userAlreadyExistsEmail = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  // Verificar se o telefone já está cadastrado na plataforma
  const userAlreadyExistsPhone = await prismaClient.user.findFirst({
    where: {
      telefone: telefone,
    },
  });
  const userAlreadyExistsUserName = await prismaClient.user.findFirst({
    where: {
      user_name: user_name,
    },
  });

  if (userAlreadyExistsUserName) {
    throw new Error("O Usuario já existe");
  }

  if (userAlreadyExistsEmail) {
    throw new Error("O email já existe");
  }

  if (userAlreadyExistsPhone) {
    throw new Error("O telefone já existe");
  }
    //gerar procees_number
     const lastUser = await prismaClient.user.findFirst({
     orderBy: { proces_number: 'desc' }
     });
    const lastNumber = lastUser ? parseInt(lastUser.proces_number) : 0;
    const newNumber = (lastNumber + 1).toString().padStart(2, '0'); 
  // Gerar uma senha aleatória
  const generatedPassword = generateRandomPassword();
  const passwordHashed = await hash(generatedPassword, 8);
  console.log("a senha é " +generatedPassword)
    // Criar o user
    
    const smsSent = await sendSmsToAdmin({
      name,
      userPhone: telefone,
      proces_number: newNumber,
      userPassword: generatedPassword,
    });

    if (!smsSent) {
      throw new Error('Erro ao enviar SMS para a administração. Usuário não criado.');
    }
  const user = await prismaClient.user.create({
    data: {
      name: name,
      proces_number:newNumber,
      email: email,
      password: passwordHashed,
      role: role,
      tipo_pagamento, 
      telefone: telefone,
      nif:nif,
      morada:morada,
      user_name: user_name,
      redes,
      autoPass:generatedPassword
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tipo_pagamento: true,
      nif:true,
      user_name:true,
      morada: true,
      proces_number: true,
      redes:true
    },
  });

  // chamar aqui

  return { user };
}
}

export { CreateUserService };
