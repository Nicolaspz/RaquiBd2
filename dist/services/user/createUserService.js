"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
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
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, role, tipo_pagamento, telefone, nif, morada, user_name, redes }) {
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
            const userAlreadyExistsEmail = yield prisma_1.default.user.findFirst({
                where: {
                    email: email,
                },
            });
            // Verificar se o telefone já está cadastrado na plataforma
            const userAlreadyExistsPhone = yield prisma_1.default.user.findFirst({
                where: {
                    telefone: telefone,
                },
            });
            const userAlreadyExistsUserName = yield prisma_1.default.user.findFirst({
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
            const lastUser = yield prisma_1.default.user.findFirst({
                orderBy: { proces_number: 'desc' }
            });
            const lastNumber = lastUser ? parseInt(lastUser.proces_number) : 0;
            const newNumber = (lastNumber + 1).toString().padStart(2, '0');
            // Gerar uma senha aleatória
            const generatedPassword = generateRandomPassword();
            const passwordHashed = yield (0, bcryptjs_1.hash)(generatedPassword, 8);
            console.log("a senha é " + generatedPassword);
            // Criar o user
            const user = yield prisma_1.default.user.create({
                data: {
                    name: name,
                    proces_number: newNumber,
                    email: email,
                    password: passwordHashed,
                    role: role,
                    tipo_pagamento,
                    telefone: telefone,
                    nif: nif,
                    morada: morada,
                    user_name: user_name,
                    redes
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    tipo_pagamento: true,
                    nif: true,
                    user_name: true,
                    morada: true,
                    proces_number: true,
                    redes: true
                },
            });
            // Enviar e-mail à área administrativa com os detalhes do novo usuário e a senha gerada
            /*await sendEmailToAdmin({
              userName: name,
              userEmail: email,
              userPhone: telefone,
              userRole: role,
              userPassword: generatedPassword, // Enviar a senha gerada
            });*/
            return { user };
        });
    }
}
exports.CreateUserService = CreateUserService;
