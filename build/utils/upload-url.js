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
var node_fetch_1 = __importDefault(require("node-fetch"));
var form_data_1 = __importDefault(require("form-data"));
var download_1 = __importDefault(require("download"));
exports.default = (function (url) {
    return new Promise(function (res, rej) { return __awaiter(void 0, void 0, void 0, function () {
        var data, _a, _b, _c, options;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    data = new form_data_1.default();
                    _b = (_a = data).append;
                    _c = ['file'];
                    return [4 /*yield*/, (0, download_1.default)(url, {
                            headers: { Accept: '*/*' },
                            method: 'GET',
                        })];
                case 1:
                    _b.apply(_a, _c.concat([(_d.sent()).toString('binary')]));
                    options = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'x-apikey': 'b2d1acfb8a44bef6ee2285df3725e9da6c38f45bde551342446793fb60709dc1',
                            'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                        },
                    };
                    // @ts-ignore
                    options.body = data;
                    (0, node_fetch_1.default)('https://www.virustotal.com/api/v3/files', options)
                        .then(function (j) { return j.json(); })
                        .then(function (re) {
                        console.log(re);
                        if (re.error) {
                            rej();
                            return;
                        }
                        res(re.data.id);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
