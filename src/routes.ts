
import { Router } from "express";
import multer from 'multer';
import {CreateUserController} from "./controllers/user/createUserController";
import { AuthUserController } from "./controllers/user/AuthUSerController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated} from "./middlewares/isAuthenticated";
import uploadConfig from './config/multer'
import { UserController } from "./controllers/user/ListandUpadate_deleteUserController";
import { crudePedidoController } from "./controllers/pedido/crudePedidoController";
import { InteracaoController } from "./controllers/Interacao/InteracaoController";

const router=Router();

const upload = multer(uploadConfig.upload("./tmp"));

const createUserController = new CreateUserController();
const userController = new UserController();
const Authcontroller =new AuthUserController();
const DetailController = new DetailUserController();
const pedidoController = new crudePedidoController();
const interacaoController = new InteracaoController();


//Routas USER
router.post('/users',createUserController.hadle)
//router.get('/users',isAuthenticated, userController.listUsers)
router.get('/all_users',isAuthenticated, userController.listAllUsers)
router.get('/user',isAuthenticated, userController.UserById)
router.put('/user',isAuthenticated, userController.updateUser)
router.delete('/user',isAuthenticated, userController.deleteUser)


router.post('/session', Authcontroller.handle)
router.get('/me', isAuthenticated,DetailController.handle)

// pedidos
router.get('/pedidos',isAuthenticated,pedidoController.listAll)
router.get('/pedidos/pending',isAuthenticated,pedidoController.listPending)
router.get('/pedidos/completed', isAuthenticated, pedidoController.listCompleted)
router.put('/pedido',isAuthenticated,pedidoController.updateStatus)
router.post('/pedido', isAuthenticated, pedidoController.create)
router.get('/pedido_user/:IdUser', isAuthenticated, pedidoController.listByIdUSer)




//Interacões
router.post("/interacoes", interacaoController.create);
router.get("/interacoes", interacaoController.listByServico);
router.put("/interacoes/:id", interacaoController.update);
router.delete("/interacoes/:id", interacaoController.delete);

router.get('/ping', (req, res) => {
  res.send('Server is running ++');
});

export {router}