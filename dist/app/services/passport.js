"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var models_1 = __importDefault(require("../models"));
var config_1 = require("../config/config");
var passport_jwt_1 = require("passport-jwt");
var passport_local_1 = require("passport-local");
;
var localLogin = new passport_local_1.Strategy({ usernameField: 'email' }, function (email, password, done) {
    models_1.default.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    });
});
var jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader('authorization'),
    secretOrKey: config_1.Config.secret,
};
var jwtLogin = new passport_jwt_1.Strategy(jwtOptions, function (payload, done) {
    models_1.default.findById(payload.sub, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    });
});
passport_1.default.use(jwtLogin);
passport_1.default.use(localLogin);
