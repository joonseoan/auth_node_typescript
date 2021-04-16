"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
var models_1 = __importDefault(require("../models/"));
var authentication = function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    if (!email || !password) {
        return res.status(422).send({ err: 'You must provide email and password' });
    }
    models_1.default.findOne({ email: email }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }
        var user = new models_1.default({
            email: email,
            password: password,
        });
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json({ success: true });
        });
    });
};
exports.authentication = authentication;
