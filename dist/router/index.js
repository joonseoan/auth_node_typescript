"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var controllers_1 = require("../controllers");
var passport_1 = __importDefault(require("passport"));
var requiredAuth = passport_1.default.authenticate('jwt', { session: false });
var router = function (app) {
    app.get('/', requiredAuth, function (req, res) {
        res.send({ hi: 'there' });
    });
    app.post('/signup', controllers_1.signup);
};
exports.default = router;
