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
exports.sendSmsToAdminFactu = sendSmsToAdminFactu;
exports.sendSmsPddo = sendSmsPddo;
const axios_1 = __importDefault(require("axios"));
function sendSmsToAdmin(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, userPhone, proces_number, userPassword, fatura, info }) {
        var _b, _c;
        const adminPhone = process.env.ADMIN_PHONE;
        const message = `${info}:
  
Nome: ${name}
${userPhone}
${proces_number}
${fatura}
${userPassword}

`;
        const smsApiUrl = process.env.SMS_API_URL;
        const smsApiKey = process.env.SMS_HUB_API_KEY;
        const smsSecretKey = process.env.SMS_HUB_SECRET_KEY;
        const smsFrom = process.env.SMS_FROM;
        let token;
        try {
            const authResponse = yield axios_1.default.post('https://app.smshub.ao/api/authentication', {
                authId: smsApiKey,
                secretKey: smsSecretKey,
            });
            if (authResponse.data.status === 200) {
                token = authResponse.data.data.authToken;
                console.log("Aki mesmo ", authResponse.data.data.authToken);
            }
            else {
                throw new Error('Falha ao autenticar com a API de SMS');
            }
        }
        catch (error) {
            console.error('Erro ao autenticar com a API de SMS:', error.message);
            return false; // Retorna false em caso de erro de autenticação
        }
        try {
            const response = yield axios_1.default.post(smsApiUrl, {
                contactNo: [adminPhone],
                message: message,
                from: smsFrom,
            }, {
                headers: {
                    accessToken: token,
                },
            });
            if (response.data.status === 200 &&
                ((_c = (_b = response.data.sms[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.status) === 1) {
                console.log('SMS enviado com sucesso');
                return true; // Retorna true se o SMS for enviado
            }
            console.error('Erro ao enviar SMS: Resposta inesperada da API', response.data);
            return false; // Retorna false em caso de falha no envio do SMS
        }
        catch (error) {
            console.error('Erro ao enviar SMS:', error.message);
            return false; // Retorna false em caso de erro ao enviar o SMS
        }
    });
}
function sendSmsPddo() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const adminPhone = process.env.ADMIN_PHONE;
        const message = `novo peidido de Serviço enviado, verifica a App`;
        const smsApiUrl = process.env.SMS_API_URL;
        const smsApiKey = process.env.SMS_HUB_API_KEY;
        const smsSecretKey = process.env.SMS_HUB_SECRET_KEY;
        const smsFrom = process.env.SMS_FROM;
        let token;
        try {
            const authResponse = yield axios_1.default.post('https://app.smshub.ao/api/authentication', {
                authId: smsApiKey,
                secretKey: smsSecretKey,
            });
            if (authResponse.data.status === 200) {
                token = authResponse.data.data.authToken;
                //console.log("Aki mesmo ",authResponse.data.data.authToken)
            }
            else {
                throw new Error('Falha ao autenticar com a API de SMS');
            }
        }
        catch (error) {
            console.error('Erro ao autenticar com a API de SMS:', error.message);
            return false; // Retorna false em caso de erro de autenticação
        }
        try {
            const response = yield axios_1.default.post(smsApiUrl, {
                contactNo: [adminPhone],
                message: message,
                from: smsFrom,
            }, {
                headers: {
                    accessToken: token,
                },
            });
            if (response.data.status === 200 &&
                ((_b = (_a = response.data.sms[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status) === 1) {
                console.log('SMS enviado com sucesso');
                return true; // Retorna true se o SMS for enviado
            }
            console.error('Erro ao enviar SMS: Resposta inesperada da API', response.data);
            return false; // Retorna false em caso de falha no envio do SMS
        }
        catch (error) {
            console.error('Erro ao enviar SMS:', error.message);
            return false; // Retorna false em caso de erro ao enviar o SMS
        }
    });
}
function sendSmsToAdminFactu(_a) {
    return __awaiter(this, arguments, void 0, function* ({ message, userPhone }) {
        var _b, _c;
        const adminPhone = userPhone;
        //const message = `Caro Cliente, o prazo de pagamento da sua factura N0º: ${fatura} está no fim.`;
        const smsApiUrl = process.env.SMS_API_URL;
        const smsApiKey = process.env.SMS_HUB_API_KEY;
        const smsSecretKey = process.env.SMS_HUB_SECRET_KEY;
        const smsFrom = process.env.SMS_FROM;
        let token;
        try {
            const authResponse = yield axios_1.default.post('https://app.smshub.ao/api/authentication', {
                authId: smsApiKey,
                secretKey: smsSecretKey,
            });
            if (authResponse.data.status === 200) {
                token = authResponse.data.data.authToken;
                //console.log("Aki mesmo ",authResponse.data.data.authToken)
            }
            else {
                throw new Error('Falha ao autenticar com a API de SMS');
            }
        }
        catch (error) {
            //console.error('Erro ao autenticar com a API de SMS:', error.message);
            return false; // Retorna false em caso de erro de autenticação
        }
        try {
            const response = yield axios_1.default.post(smsApiUrl, {
                contactNo: [adminPhone],
                message: message,
                from: smsFrom,
            }, {
                headers: {
                    accessToken: token,
                },
            });
            if (response.data.status === 200 &&
                ((_c = (_b = response.data.sms[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.status) === 1) {
                console.log('SMS enviado com sucesso');
                return true; // Retorna true se o SMS for enviado
            }
            console.error('Erro ao enviar SMS: Resposta inesperada da API', response.data);
            return false; // Retorna false em caso de falha no envio do SMS
        }
        catch (error) {
            console.error('Erro ao enviar SMS:', error.message);
            return false; // Retorna false em caso de erro ao enviar o SMS
        }
    });
}
