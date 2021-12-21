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
// @ts-ignore
var node_virustotal_1 = __importDefault(require("node-virustotal"));
exports.default = (function (id, msg, a) {
    // this is dumb
    // i just go 10 times until it works
    return new Promise(function (resolve, rej) { return __awaiter(void 0, void 0, void 0, function () {
        var mess, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, msg.reply('Analyzing...')];
                case 1:
                    mess = _a.sent();
                    instance = node_virustotal_1.default.makeAPI(60000);
                    instance.setKey(process.env.VIRUSTOTAL || '');
                    instance.fileLookup(id, function (err, res) {
                        if (err) {
                            console.error(err);
                            rej();
                        }
                        else {
                            // let f = createWriteStream(`${__dirname}/out/bruh.json`);
                            // f.write(res);
                            // f.close();
                            var r_1 = JSON.parse(res).data.attributes.last_analysis_results;
                            var h = JSON.parse(res).data.attributes;
                            var n_1 = { safe: 0, sus: 0, mal: 0 };
                            Object.keys(r_1).forEach(function (a) {
                                switch (r_1[a].category) {
                                    case 'harmless':
                                    case 'undetected':
                                        n_1.safe += 1;
                                        break;
                                    case 'suspicious':
                                        n_1.sus += 1;
                                        break;
                                    case 'malicious':
                                        n_1.mal += 1;
                                        break;
                                    default:
                                        n_1.safe += 1;
                                        break;
                                }
                            });
                            // console.log({ r });
                            var bruh = {
                                results: {
                                    harmless: n_1.safe,
                                    suspicious: n_1.sus,
                                    malicious: n_1.mal,
                                },
                                name: a.name || 'unknown',
                                type: a.contentType || 'application/octet-stream',
                                url: a.proxyURL,
                                md5: h.md5,
                                sha256: h.sha256,
                                sha1: h.sha1,
                            };
                            console.log(r_1);
                            console.log(bruh);
                            mess.delete();
                            resolve(bruh);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
