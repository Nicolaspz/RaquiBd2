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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
class UserServices {
    UserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação da listagem de usuários de uma organização específica
            return prisma.user.findFirst({
                where: { id },
            });
        });
    }
    listAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação da listagem de usuários de uma organização específica
            return prisma.user.findMany();
        });
    }
    updateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, name, email, role, password }) {
            // Verifica se o usuário existe antes de atualizá-lo
            const existingUser = yield prisma.user.findUnique({
                where: { id: userId },
            });
            if (!existingUser) {
                throw new Error("User not found");
            }
            const passwordHas = yield (0, bcryptjs_1.hash)(password, 8);
            return prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    email,
                    role,
                    password: passwordHas,
                },
            });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield prisma.user.findUnique({
                where: { id: userId },
            });
            if (!existingUser) {
                throw new Error("Usuário não encontrado");
            }
            // Verifica se o usuário está associado a alguma serviço
            const ordersCount = yield prisma.servico.count({
                where: { id: userId },
            });
            if (ordersCount > 0) {
                throw new Error("Usuário associado a pedidos. Não pode ser excluído.");
            }
            return prisma.user.delete({
                where: { id: userId },
            });
        });
    }
}
exports.UserServices = UserServices;
