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
exports.sendSmsToAdmin = sendSmsToAdmin;
const axios_1 = __importDefault(require("axios"));
function sendSmsToAdmin(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userName, userEmail, userPhone, userRole, userPassword }) {
        const adminPhone = process.env.ADMIN_PHONE; // Número de telefone da área administrativa
        const message = `Novo usuário criado:\nNome: ${userName}\nEmail: ${userEmail}\nTelefone: ${userPhone}\nFunção: ${userRole}\nSenha: ${userPassword}`;
        // Configurações para a API do SMSHUB
        const response = yield axios_1.default.post('https://api.smshub.com/sms/send', {
            to: adminPhone,
            message: message,
            // outros parâmetros necessários pela API do SMSHUB
            api_key: process.env.SMSHUB_API_KEY // Chave da API do SMSHUB
        });
        if (response.data.status !== 'success') {
            throw new Error('Erro ao enviar SMS para a administração');
        }
    });
}
