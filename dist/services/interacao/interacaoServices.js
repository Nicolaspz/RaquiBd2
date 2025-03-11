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
exports.InteracaoService = void 0;
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const smsService_1 = require("../../utils/smsService");
const prisma = new client_1.PrismaClient();
class InteracaoService {
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ conteudo, autorId, servicoId, tipo }) {
            // Verificar se o serviço já possui interações
            const servico = yield prisma.servico.findUnique({
                where: { id: servicoId },
                include: { Interacao: true, Fatura: true },
            });
            if (!servico)
                throw new Error("Serviço não encontrado.");
            // Caso já tenha interações, apenas adicionar a interação
            if (servico.Interacao.length > 0) {
                return prisma.interacao.create({
                    data: { conteudo, autorId, servicoId, tipo },
                });
            }
            // Enviar notificação SMS para o usuário relacionado ao serviço
            const usuario = yield prisma.user.findUnique({
                where: { id: servico.usuarioId },
            });
            if (!usuario)
                throw new Error("Usuário relacionado ao serviço não encontrado.");
            const mensagem = `Prezado(a) ${usuario.name}, a sua solicitação foi aceite. Abra o App para mais detalhes. Obrigado!`;
            try {
                const smsSent = yield (0, smsService_1.sendSmsToAdminFactu)({
                    message: mensagem,
                    userPhone: usuario.telefone,
                });
                if (!smsSent) {
                    console.log("Erro");
                }
            }
            catch (error) {
            }
            // Lógica para criação de fatura
            let faturaAberta = null;
            if (servico.tipo === "SERVICO_24h" || servico.tipo === "SERVICO_30_DIAS") {
                // Sempre criar uma nova fatura para esses tipos de serviço
                const numeroFatura = this.gerarNumeroFatura();
                const dataVencimento = this.calcularVencimentoPorTipo(servico.tipo);
                faturaAberta = yield prisma.fatura.create({
                    data: {
                        numero: numeroFatura,
                        usuarioId: servico.usuarioId,
                        data_vencimento: dataVencimento,
                        servicos: { connect: { id: servicoId } },
                    },
                });
            }
            else {
                // Para outros serviços, verificar se existe fatura aberta
                faturaAberta = yield prisma.fatura.findFirst({
                    where: {
                        usuarioId: servico.usuarioId,
                        status: "ABERTA",
                        servicos: {
                            none: {
                                tipo: { in: ["SERVICO_24h", "SERVICO_30_DIAS"] },
                            },
                        },
                    },
                });
                if (!faturaAberta) {
                    // Criar nova fatura caso não exista nenhuma aberta ou se a aberta for do tipo 24h ou 30 dias
                    const numeroFatura = this.gerarNumeroFatura();
                    const dataVencimento = this.calcularVencimento(usuario.tipo_pagamento);
                    faturaAberta = yield prisma.fatura.create({
                        data: {
                            numero: numeroFatura,
                            usuarioId: servico.usuarioId,
                            data_vencimento: dataVencimento,
                            servicos: { connect: { id: servicoId } },
                        },
                    });
                }
                else {
                    // Vincular o serviço à fatura existente
                    yield prisma.servico.update({
                        where: { id: servicoId },
                        data: { faturaId: faturaAberta.id },
                    });
                }
            }
            // Criar a interação
            return prisma.interacao.create({
                data: { conteudo, autorId, servicoId, tipo },
            });
        });
    }
    // Gerar número de fatura (método auxiliar)
    gerarNumeroFatura() {
        const dataPrefixo = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Ex: 20241129
        const numeroAleatorio = Math.floor(10 + Math.random() * 90); // Garante 2 dígitos aleatórios
        return `FO-${dataPrefixo}${numeroAleatorio}`;
    }
    // Calcular vencimento por tipo de serviço (método auxiliar)
    calcularVencimentoPorTipo(tipo) {
        const dataVencimento = new Date();
        if (tipo === "SERVICO_24h") {
            dataVencimento.setHours(dataVencimento.getHours() + 24);
        }
        else if (tipo === "SERVICO_30_DIAS") {
            dataVencimento.setDate(dataVencimento.getDate() + 3);
        }
        return dataVencimento;
    }
    // Método para listar interações de um serviço
    listByServico(servicoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.interacao.findMany({
                where: { servicoId },
                orderBy: { criado_em: "asc" },
            });
        });
    }
    // Método para atualizar uma interação
    update(id, conteudo) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.interacao.update({
                where: { id },
                data: { conteudo },
            });
        });
    }
    // Método para excluir uma interação
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.interacao.delete({ where: { id } });
        });
    }
    // Função para calcular vencimento da fatura
    calcularVencimento(tipoPagamento) {
        const dias = {
            CONTA_3DIAS: 3,
            CONTA_7DIAS: 7,
            CONTA_15DIAS: 15,
            CONTA_30DIAS: 30,
            CONTA_24H: 1,
        };
        return (0, moment_1.default)().add(dias[tipoPagamento] || 7, "days").toDate();
    }
}
exports.InteracaoService = InteracaoService;
