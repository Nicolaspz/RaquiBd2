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
const smsService_1 = require("../../utils/smsService");
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
            // Verificar se enviou telefone
            if (!telefone) {
                throw new Error("Telefone incorreto");
            }
            if (!user_name) {
                throw new Error("Username incorreto");
            }
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
                throw new Error("O Usuário já existe");
            }
            if (userAlreadyExistsPhone) {
                throw new Error("O telefone já existe");
            }
            // Verificar se o email foi fornecido e já está cadastrado
            if (email) {
                const userAlreadyExistsEmail = yield prisma_1.default.user.findFirst({
                    where: {
                        email: email,
                    },
                });
                if (userAlreadyExistsEmail) {
                    throw new Error("O email já existe");
                }
            }
            // Gerar um número de processo
            const lastUser = yield prisma_1.default.user.findFirst({
                orderBy: { proces_number: 'desc' },
            });
            const lastNumber = lastUser ? parseInt(lastUser.proces_number) : 0;
            const newNumber = (lastNumber + 1).toString().padStart(2, '0');
            // Gerar uma senha aleatória
            const generatedPassword = generateRandomPassword();
            const passwordHashed = yield (0, bcryptjs_1.hash)(generatedPassword, 8);
            console.log("A senha é " + generatedPassword);
            // Enviar SMS para a administração
            const smsSent = yield (0, smsService_1.sendSmsToAdmin)({
                name,
                userPhone: telefone,
                proces_number: newNumber,
                fatura: tipo_pagamento,
                userPassword: generatedPassword,
                info: "Novo Cliente Criado",
            });
            if (!smsSent) {
                throw new Error('Erro ao enviar SMS para a administração. Usuário não criado.');
            }
            // Criar o usuário
            const user = yield prisma_1.default.user.create({
                data: {
                    name: name,
                    proces_number: newNumber,
                    email: email || null, // Permitir que o email seja nulo
                    password: passwordHashed,
                    role: role,
                    tipo_pagamento,
                    telefone: telefone,
                    nif: nif,
                    morada: morada || null,
                    user_name: user_name,
                    redes,
                    autoPass: generatedPassword,
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
                    redes: true,
                },
            });
            return { user };
        });
    }
    updatePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !oldPassword || !newPassword) {
                throw new Error("ID do usuário, senha atual e nova senha são obrigatórios.");
            }
            // Busca o usuário no banco de dados
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error("Usuário não encontrado.");
            }
            // Verifica se a senha antiga está correta
            const passwordMatch = yield (0, bcryptjs_1.compare)(oldPassword, user.password);
            if (!passwordMatch) {
                throw new Error("Senha atual incorreta.");
            }
            const isSamePassword = yield (0, bcryptjs_1.compare)(newPassword, user.password);
            if (isSamePassword) {
                throw new Error("A nova senha não pode ser igual à anterior.");
            }
            // Hash da nova senha
            const passwordHashed = yield (0, bcryptjs_1.hash)(newPassword, 8);
            // Atualiza a senha no banco de dados
            yield prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    password: passwordHashed,
                    autoPass: newPassword
                },
            });
            return { message: "Senha atualizada com sucesso." };
        });
    }
}
exports.CreateUserService = CreateUserService;
