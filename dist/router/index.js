"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controllers_1 = require("../controllers");
var router = function (app) {
    app.post('/signup', controllers_1.authentication);
};
exports.default = router;
