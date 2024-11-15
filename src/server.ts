import express from 'express';
import cors from 'cors';
import { CreateUserController } from './controllers/user/createUserController';
import { AuthUserController } from './controllers/user/AuthUSerController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { UserController } from './controllers/user/ListandUpadate_deleteUserController';
import { crudePedidoController } from './controllers/pedido/crudePedidoController';
import { InteracaoController } from './controllers/Interacao/InteracaoController';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



const createUserController = new CreateUserController();
const userController = new UserController();
const authController = new AuthUserController();
const detailController = new DetailUserController();
const pedidoController = new crudePedidoController();
const interacaoController = new InteracaoController();

// Rotas USER
app.post('/users', createUserController.hadle);
app.get('/all_users', isAuthenticated, userController.listAllUsers);
app.get('/user', isAuthenticated, userController.UserById);
app.put('/user', isAuthenticated, userController.updateUser);
app.delete('/user', isAuthenticated, userController.deleteUser);

app.post('/session', authController.handle);
app.get('/me', isAuthenticated, detailController.handle);

// Rotas PEDIDOS
app.get('/pedidos', isAuthenticated, pedidoController.listAll);
app.get('/pedidos/pending', isAuthenticated, pedidoController.listPending);
app.get('/pedidos/completed', isAuthenticated, pedidoController.listCompleted);
app.put('/pedido', isAuthenticated, pedidoController.updateStatus);
app.post('/pedido', isAuthenticated, pedidoController.create);
app.get('/pedido_user/:IdUser', isAuthenticated, pedidoController.listByIdUSer);

// Rotas INTERAÇÕES
app.post('/interacoes', interacaoController.create);
app.get('/interacoes', interacaoController.listByServico);
app.put('/interacoes/:id', interacaoController.update);
app.delete('/interacoes/:id', interacaoController.delete);

// Test route
app.get('/ping', (req, res) => {
  res.send('Server is running ++');
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
