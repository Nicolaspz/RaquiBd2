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
const prisma_1 = __importDefault(require("../../prisma"));
class InteracaoService {
    // Método para criar uma nova interação
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ conteudo, autorId, servicoId, tipo }) {
            const interacao = yield prisma_1.default.interacao.create({
                data: {
                    conteudo,
                    autorId,
                    servicoId,
                    tipo,
                },
                select: {
                    id: true,
                    conteudo: true,
                    autorId: true,
                    servicoId: true,
                    criado_em: true,
                    tipo: true,
                },
            });
            return interacao;
        });
    }
    // Método para listar todas as interações de um serviço específico
    listByServico(servicoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interacoes = yield prisma_1.default.interacao.findMany({
                where: {
                    servicoId,
                },
                select: {
                    id: true,
                    conteudo: true,
                    autorId: true,
                    servicoId: true,
                    criado_em: true,
                    tipo: true,
                },
            });
            return interacoes;
        });
    }
    update(id, conteudo) {
        return __awaiter(this, void 0, void 0, function* () {
            const interacao = yield prisma_1.default.interacao.update({
                where: { id },
                data: { conteudo },
                select: { id: true, conteudo: true, autorId: true, servicoId: true, criado_em: true, tipo: true },
            });
            return interacao;
        });
    }
    // Método para excluir uma interação
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.interacao.delete({
                where: { id },
            });
        });
    }
}
exports.InteracaoService = InteracaoService;
