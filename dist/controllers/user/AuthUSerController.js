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
exports.AuthUserController = void 0;
const AuthUserServices_1 = require("../../services/user/AuthUserServices");
class AuthUserController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credential, password } = req.body; // Altera para 'credential'
            const authService = new AuthUserServices_1.AuthUserService();
            try {
                const auth = yield authService.execute({ credential, password });
                return res.json(auth);
            }
            catch (error) {
                return res.status(400).json({ error: error.message }); // Retorna erro com status 400
            }
        });
    }
}
exports.AuthUserController = AuthUserController;
