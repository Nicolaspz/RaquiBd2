"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    //Receber o Token
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).end();
    }
    //console.log(authToken);
    //separamos
    const [, token] = authToken.split(" ");
    try {
        //validar o token
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // reqcuperar o id e envia no Request para recuperar
        req.user_id = sub;
        return next();
    }
    catch (error) {
        return res.status(401).end();
    }
}
