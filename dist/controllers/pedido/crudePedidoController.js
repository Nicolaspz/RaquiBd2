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
exports.crudePedidoController = void 0;
const ServicoService_1 = require("../../services/servic/ServicoService"); // ajuste o caminho conforme necessário
class crudePedidoController {
    // Método para criar um novo serviço
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { descricao, status, usuarioId, tipo } = req.body;
                const servicoService = new ServicoService_1.ServicoService();
                const servico = yield servicoService.create({ descricao, status, usuarioId, tipo });
                return res.status(201).json(servico); // Retorna o serviço criado
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
    // Método para listar todos os serviços
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicoService = new ServicoService_1.ServicoService();
                const servicos = yield servicoService.listAll();
                return res.status(200).json(servicos); // Retorna todos os serviços
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar serviços" });
            }
        });
    }
    // Método para listar serviços pendentes
    listPending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicoService = new ServicoService_1.ServicoService();
                const servicos = yield servicoService.listPending();
                return res.status(200).json(servicos); // Retorna serviços pendentes
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar serviços pendentes" });
            }
        });
    }
    // Método para listar serviços concluídos
    listByIdUSerStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IdUser, status } = req.params;
            try {
                const servicoService = new ServicoService_1.ServicoService();
                const servicos = yield servicoService.listByUsuario(IdUser);
                return res.status(200).json(servicos); // Retorna serviços do user
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar serviços concluídos" });
            }
        });
    }
    listByIdUSer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IdUser } = req.params;
            try {
                const servicoService = new ServicoService_1.ServicoService();
                const servicos = yield servicoService.listByUsuario(IdUser);
                return res.status(200).json(servicos); // Retorna serviços do user
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar serviços concluídos" });
            }
        });
    }
    // Método para listar serviços concluídos
    listCompleted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicoService = new ServicoService_1.ServicoService();
                const servicos = yield servicoService.listCompleted();
                return res.status(200).json(servicos); // Retorna serviços concluídos
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao listar serviços concluídos" });
            }
        });
    }
    // Método para atualizar o status de um serviço
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                const servicoService = new ServicoService_1.ServicoService();
                const servico = yield servicoService.updateStatus({ id, status });
                return res.status(200).json(servico); // Retorna o serviço atualizado
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.crudePedidoController = crudePedidoController;
