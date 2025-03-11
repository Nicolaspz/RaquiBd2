"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const createUserController_1 = require("./controllers/user/createUserController");
const AuthUSerController_1 = require("./controllers/user/AuthUSerController");
const DetailUserController_1 = require("./controllers/user/DetailUserController");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const ListandUpadate_deleteUserController_1 = require("./controllers/user/ListandUpadate_deleteUserController");
const crudePedidoController_1 = require("./controllers/pedido/crudePedidoController");
const InteracaoController_1 = require("./controllers/Interacao/InteracaoController");
const FaturaContoller_1 = require("./controllers/fatura/FaturaContoller");
const router = (0, express_1.Router)();
exports.router = router;
const faturaController = new FaturaContoller_1.FaturaController();
const createUserController = new createUserController_1.CreateUserController();
const userController = new ListandUpadate_deleteUserController_1.UserController();
const Authcontroller = new AuthUSerController_1.AuthUserController();
const DetailController = new DetailUserController_1.DetailUserController();
const pedidoController = new crudePedidoController_1.crudePedidoController();
const interacaoController = new InteracaoController_1.InteracaoController();
//Routas USER
router.post('/users', createUserController.hadle);
//router.get('/users',isAuthenticated, userController.listUsers)
router.get('/all_users', isAuthenticated_1.isAuthenticated, userController.listAllUsers);
router.get('/user', isAuthenticated_1.isAuthenticated, userController.UserById);
router.put('/user', isAuthenticated_1.isAuthenticated, userController.updateUser);
router.delete('/user', isAuthenticated_1.isAuthenticated, userController.deleteUser);
router.put('/change-password', isAuthenticated_1.isAuthenticated, createUserController.updatePassword);
router.post('/session', Authcontroller.handle);
router.get('/me', isAuthenticated_1.isAuthenticated, DetailController.handle);
// pedidos
router.get('/pedidos', isAuthenticated_1.isAuthenticated, pedidoController.listAll);
router.get('/pedidos/pending', isAuthenticated_1.isAuthenticated, pedidoController.listPending);
router.get('/pedidos/completed', isAuthenticated_1.isAuthenticated, pedidoController.listCompleted);
router.put('/pedido', isAuthenticated_1.isAuthenticated, pedidoController.updateStatus);
router.post('/pedido', isAuthenticated_1.isAuthenticated, pedidoController.create);
router.get('/pedido_user/:IdUser', isAuthenticated_1.isAuthenticated, pedidoController.listByIdUSer);
router.delete('/pedido_user/:IdFatura', isAuthenticated_1.isAuthenticated, pedidoController.deletar);
//Interacões
router.post("/interacoes", isAuthenticated_1.isAuthenticated, interacaoController.create);
router.get("/interacoes", isAuthenticated_1.isAuthenticated, interacaoController.listByServico);
router.put("/interacoes/:id", isAuthenticated_1.isAuthenticated, interacaoController.update);
router.delete("/interacoes/:id", isAuthenticated_1.isAuthenticated, interacaoController.delete);
//fatura
router.get("/fatura", isAuthenticated_1.isAuthenticated, faturaController.listar); // Listar faturas
router.get("/fatura/:IdUser", isAuthenticated_1.isAuthenticated, faturaController.listarById); // Listar faturas
router.delete("/fatura/:id", isAuthenticated_1.isAuthenticated, faturaController.eliminar); // Eliminar fatura
router.put("/fatura/:id", isAuthenticated_1.isAuthenticated, faturaController.fechar); // Fechar fatura aqui 
router.get("/verificar", faturaController.executarVerificacao);
router.get('/ping', (req, res) => {
    res.send('Server is running ++');
});
