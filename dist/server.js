"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http")); // Para criar o servidor HTTP
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:8081", "https://raqui.vercel.app"], // Lista de origens permitidas
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
    credentials: true, // Permite envio de cookies e cabeçalhos de autenticação
};
// Cria o servidor HTTP
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use(routes_1.router);
// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }
    return res.status(500).json({
        status: "Error",
        message: "Internal Error.",
    });
});
// Inicia o servidor na porta especificada
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => console.log(`Servidor online na porta ${PORT}`));
