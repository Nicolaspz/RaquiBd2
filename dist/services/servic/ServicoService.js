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
exports.ServicoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const smsService_1 = require("../../utils/smsService");
class ServicoService {
    // Método para criar um novo serviço
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ descricao, status, usuarioId, tipo }) {
            const servico = yield prisma_1.default.servico.create({
                data: {
                    descricao, // Campo opcional, pode ser undefined
                    status,
                    usuarioId,
                    tipo
                }, //as Prisma.ServicoUncheckedCreateInput,
                select: {
                    id: true,
                    descricao: true,
                    status: true,
                    usuarioId: true,
                    tipo: true,
                    created_at: true,
                },
            });
            //console.log(servico);
            if (servico) {
                const smsSent = yield (0, smsService_1.sendSmsPddo)();
                if (!smsSent) {
                    console.log("Falha ao enviar SMS.");
                }
            }
            return { servico }; // Retorna o serviço diretamente
        });
    }
    // Método para listar todos os serviços
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const servicos = yield prisma_1.default.servico.findMany({
                select: {
                    id: true,
                    descricao: true,
                    status: true,
                    usuarioId: true,
                    tipo: true,
                    created_at: true,
                    usuario: {
                        select: {
                            proces_number: true,
                            tipo_pagamento: true
                        }
                    },
                    Interacao: {
                        select: {
                            id: true,
                            conteudo: true,
                            autorId: true,
                            tipo: true,
                            criado_em: true,
                        },
                        orderBy: {
                            criado_em: 'asc', // Ordena as interações pela data de criação, da mais recente para a mais antiga
                        },
                    },
                },
            });
            return servicos; // Retorna os serviços diretamente
        });
    }
    // Método para listar serviços pendentes
    listPending() {
        return __awaiter(this, void 0, void 0, function* () {
            const servicos = yield prisma_1.default.servico.findMany({
                where: {
                    status: 'PENDENTE',
                },
                select: {
                    id: true,
                    descricao: true,
                    status: true,
                    usuarioId: true,
                    tipo: true
                },
            });
            return { servicos }; // Retorna os serviços pendentes diretamente
        });
    }
    // Método para listar serviços concluídos
    listCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            const servicos = yield prisma_1.default.servico.findMany({
                where: {
                    status: 'CONCLUIDO',
                },
                select: {
                    id: true,
                    descricao: true,
                    status: true,
                    usuarioId: true,
                    tipo: true
                },
            });
            return servicos; // Retorna os serviços concluídos diretamente
        });
    }
    // Método para atualizar o status de um serviço
    updateStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, status }) {
            const servico = yield prisma_1.default.servico.update({
                where: {
                    id,
                },
                data: {
                    status,
                },
                select: {
                    id: true,
                    descricao: true,
                    status: true,
                    usuarioId: true,
                },
            });
            return servico; // Retorna o serviço atualizado diretamente
        });
    }
    listByUsuario(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const servicos = yield prisma_1.default.servico.findMany({
                where: {
                    usuarioId,
                },
                select: {
                    id: true,
                    descricao: true,
                    status: true,
                    usuarioId: true,
                    tipo: true,
                    created_at: true,
                    usuario: {
                        select: {
                            proces_number: true,
                            tipo_pagamento: true
                        }
                    },
                    Interacao: {
                        select: {
                            id: true,
                            conteudo: true,
                            autorId: true,
                            tipo: true,
                            criado_em: true,
                        },
                        orderBy: {
                            criado_em: 'desc', // Ordena as interações pela data de criação, da mais recente para a mais antiga
                        },
                    },
                },
            });
            return servicos;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.servico.delete({ where: { id } });
        });
    }
}
exports.ServicoService = ServicoService;
