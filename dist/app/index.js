"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var morgan_1 = __importDefault(require("morgan"));
var mongoose_1 = __importDefault(require("mongoose"));
require("./services/passport");
var router_1 = __importDefault(require("./router"));
var app = express_1.default();
exports.app = app;
var mongoURI = 'mongodb+srv://joon:1111@cluster0.bffbk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
app.use(morgan_1.default('combined'));
app.use(body_parser_1.default.json({ type: '*/*' }));
mongoose_1.default.set('useNewUrlParser', true);
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.connect(mongoURI, {
    useUnifiedTopology: true,
});
router_1.default(app);
var port = process.env.PORT || 3090;
var server = http_1.default.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
