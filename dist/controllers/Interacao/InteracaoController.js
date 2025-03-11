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
exports.InteracaoController = void 0;
const interacaoServices_1 = require("../../services/interacao/interacaoServices"); // Ajuste o caminho, se necessário
class InteracaoController {
    // Método para criar uma nova interação
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conteudo, autorId, servicoId, tipo } = req.body;
            const interacaoService = new interacaoServices_1.InteracaoService();
            try {
                const interacao = yield interacaoService.create({
                    conteudo,
                    autorId,
                    servicoId,
                    tipo,
                });
                // Verificar se a interação foi criada com sucesso
                if (interacao) {
                    // Se a fatura foi criada ou vinculada com sucesso
                    return res.status(201).json({
                        message: "Interação criada com sucesso.",
                        interacao,
                    });
                }
                return res.status(400).json({
                    message: "Erro ao criar interação. Fatura não associada corretamente.",
                });
            }
            catch (error) {
                return res.status(500).json({
                    error: "Erro ao criar interação",
                    message: error.message || "Ocorreu um erro desconhecido",
                });
            }
        });
    }
    // Método para listar todas as interações de um serviço específico
    listByServico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { servicoId } = req.params;
            const interacaoService = new interacaoServices_1.InteracaoService();
            try {
                const interacoes = yield interacaoService.listByServico(servicoId);
                return res.json(interacoes);
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar interações", details: error });
            }
        });
    }
    // Método para atualizar uma interação
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { conteudo } = req.body;
            const interacaoService = new interacaoServices_1.InteracaoService();
            try {
                const interacao = yield interacaoService.update(id, conteudo);
                return res.json(interacao);
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao atualizar interação", details: error });
            }
        });
    }
    // Método para excluir uma interação
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const interacaoService = new interacaoServices_1.InteracaoService();
            try {
                yield interacaoService.delete(id);
                return res.json({ message: "Interação excluída com sucesso" });
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao excluir interação", details: error });
            }
        });
    }
}
exports.InteracaoController = InteracaoController;
