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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var mongoose_1 = __importDefault(require("mongoose"));
var jwt_simple_1 = __importDefault(require("jwt-simple"));
var app_1 = require("../app");
var config_1 = require("../app/config/config");
var models_1 = __importDefault(require("../app/models"));
var mongoURI = 'mongodb+srv://joon:1111@cluster0.bffbk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
describe('Test', function () {
    var token;
    var tempUser = {
        email: 'a@afa.ca',
        password: 'abcde',
    };
    var tempUser2 = {
        email: 'c@a.ca',
        password: 'abcde',
    };
    beforeAll(function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, mongoose_1.default.connect(mongoURI, {
                        useNewUrlParser: true,
                    })];
                case 1:
                    _a.sent();
                    supertest_1.default(app_1.app)
                        .post('/signup')
                        .send(tempUser)
                        .end(function (err, response) {
                        token = response.body.token;
                        done();
                    });
                    return [2];
            }
        });
    }); });
    afterAll(function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, models_1.default.deleteMany()];
                case 1:
                    _a.sent();
                    return [4, mongoose_1.default.connection.close()];
                case 2:
                    _a.sent();
                    done();
                    return [2];
            }
        });
    }); });
    it('should have status 401 for unauthorized request', function (done) {
        supertest_1.default(app_1.app)
            .get('/')
            .set('authorization', '')
            .expect(401)
            .end(done);
    });
    it('should have status 401 for invalid token', function (done) {
        var userId = mongoose_1.default.Types.ObjectId();
        var invalidToken = jwt_simple_1.default.encode({
            sub: userId,
            iat: new Date().getTime()
        }, config_1.Config.secret);
        supertest_1.default(app_1.app)
            .get('/')
            .set('authorization', invalidToken)
            .expect(401)
            .end(done);
    });
    it('should have status 200 for invalid token', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, supertest_1.default(app_1.app)
                        .get('/')
                        .set('authorization', token)
                        .expect(200)];
                case 1:
                    response = _a.sent();
                    expect(response.body).toEqual({ hi: 'there' });
                    return [2];
            }
        });
    }); });
    it('should not make the user login with invalid email', function () { return __awaiter(void 0, void 0, void 0, function () {
        var invalidUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invalidUser = {
                        email: 'b@afa.ca',
                        password: 'abcde',
                    };
                    return [4, supertest_1.default(app_1.app)
                            .post('/signin')
                            .send(invalidUser)
                            .expect(401)];
                case 1:
                    response = _a.sent();
                    return [2];
            }
        });
    }); });
    it('should not make the user login with invalid password', function () { return __awaiter(void 0, void 0, void 0, function () {
        var invalidUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invalidUser = {
                        email: 'a@afa.ca',
                        password: 'abcdee',
                    };
                    return [4, supertest_1.default(app_1.app)
                            .post('/signin')
                            .send(invalidUser)
                            .expect(401)];
                case 1:
                    response = _a.sent();
                    return [2];
            }
        });
    }); });
    it('should make the user login', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, supertest_1.default(app_1.app)
                        .post('/signin')
                        .send(tempUser)
                        .expect(200)];
                case 1:
                    response = _a.sent();
                    expect(response.body.token).not.toBeFalsy();
                    return [2];
            }
        });
    }); });
    it('should not make the same user signup', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, supertest_1.default(app_1.app)
                        .post('/signup')
                        .send(tempUser)
                        .expect(422)];
                case 1:
                    response = _a.sent();
                    return [2];
            }
        });
    }); });
    it('should not make the same user signup', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, supertest_1.default(app_1.app)
                        .post('/signup')
                        .send(tempUser)
                        .expect(422)];
                case 1:
                    response = _a.sent();
                    return [2];
            }
        });
    }); });
    it('should make the user signup', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var response, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, supertest_1.default(app_1.app)
                        .post('/signup')
                        .send(tempUser2)
                        .expect(200)];
                case 1:
                    response = _a.sent();
                    expect(response.body.token).not.toBeFalsy();
                    return [4, models_1.default.findOne({ email: tempUser2.email })];
                case 2:
                    user = _a.sent();
                    expect(user).not.toBeNull();
                    done();
                    return [2];
            }
        });
    }); });
});
