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
exports.CreateUserController = void 0;
const createUserService_1 = require("../../services/user/createUserService");
class CreateUserController {
    hadle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body);
            const { name, email, role, telefone, tipo_pagamento, nif, morada, user_name, redes } = req.body;
            const createUserService = new createUserService_1.CreateUserService();
            const user = yield createUserService.execute({
                name, email, role, tipo_pagamento, telefone, nif, morada, user_name, redes
            });
            return res.json(user);
        });
    }
}
exports.CreateUserController = CreateUserController;
