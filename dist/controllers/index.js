"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
var jwt_simple_1 = __importDefault(require("jwt-simple"));
var models_1 = __importDefault(require("../models/"));
var config_1 = require("../config/config");
function tokenForUser(user) {
    return jwt_simple_1.default.encode({
        sub: user._id,
        iat: new Date().getTime()
    }, config_1.Config.secret);
}
;
var signup = function (req, res, next) {
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
        console.log('user: ---> ', user);
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json({ token: tokenForUser(user) });
        });
    });
};
exports.signup = signup;
