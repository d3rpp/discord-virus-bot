"use strict";
// load up dotenv
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
var discord_js_1 = require("discord.js");
var dotenv_1 = require("dotenv");
var upload_url_1 = __importDefault(require("./utils/upload-url"));
var get_status_1 = __importDefault(require("./utils/get-status"));
// @ts-ignore
// globalThis.fetch = fetch;
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    ],
});
// let virustotal = new VirusTotalApi(process.env.VIRUSTOTAL!);
var SUS_TYPES = [
    null,
    'application/zip',
    'application/gzip',
    'application/x-msdos-program',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
// const SUS_EXTENSIONS = [
// 	'.exe',
// 	'.app',
// 	'.jar',
// 	'.bat',
// 	'.vbs',
// 	'.command',
// 	'.cmd',
// 	'.xlsx',
// 	'.docx',
// 	'.pptx',
// 	'.ppsx',
// ];
console.clear();
(0, dotenv_1.config)();
// check if it has the required keys
if (!process.env.DISCORD || !process.env.VIRUSTOTAL) {
    // error out problems
    console.error('❌ No Keys for Discord OR Virustotal, unable to init application');
    console.error({
        discord: process.env.DISCORD,
        virustotal: process.env.VIRUSTOTAL,
    });
    process.exit(1);
}
console.info('✅ Loaded ENV');
// load discord
try {
    client.login(process.env.DISCORD);
    // console.info('✅ Discord Login Complete');
}
catch (e) {
    console.error('❌ Failed to login to discord');
    process.exit(2);
}
console.info('✅ Logged into Discord');
// complete init checking
// Initialise event listeners
client.on('ready', function () {
    var _a;
    console.log("\u2705 Logged into Discord as '".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag, "'"));
    console.info('✅ Ready');
});
client.on('messageCreate', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var is_sus_1;
    var _a;
    return __generator(this, function (_b) {
        // the bot shouldn't respond to itself
        if (msg.author.tag == ((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag))
            return [2 /*return*/];
        if (msg.attachments.size > 0) {
            is_sus_1 = false;
            msg.attachments.forEach(function (a) {
                if (SUS_TYPES.includes(a.contentType)) {
                    is_sus_1 = true;
                }
            });
            if (!is_sus_1) {
                msg.react('✅');
                return [2 /*return*/];
            }
            msg.attachments.forEach(function (a) { return __awaiter(void 0, void 0, void 0, function () {
                var id, e_1, status_1, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // a.setSpoiler();
                            msg.react('❔');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, upload_url_1.default)(a.url, a.name || 'unnamed-file', a.contentType || 'application/octet-stream', msg)];
                        case 2:
                            id = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error('UNABLE TO UPLOAD URL');
                            return [3 /*break*/, 4];
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            if (!id) {
                                msg.reply('UNABLE TO GET VIRUS SCAN RESULTS');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, (0, get_status_1.default)(id, msg, a)];
                        case 5:
                            status_1 = _a.sent();
                            msg.reply("=== **VIRUSTOTAL REPORT** ===\n**File Details**\n\t*Name*: \t".concat(status_1.name, "\n\t*Type*:\t").concat(status_1.type, "\n\t*URL*: \t").concat(status_1.url, "\n\n\t*SHA-256*: \t`").concat(status_1.sha256, "`\n\t*SHA-1*: \t`").concat(status_1.sha1, "`\n\t*MD5*: \t`").concat(status_1.md5, "`\n\n**Scan Results**\n\t\u2705\t ").concat(status_1.results.harmless, " scanners marked the file as **Harmless** or were unable to detect any malware.\n\t\u2754\t ").concat(status_1.results.suspicious, " scanners marked the file as **Suspicious**.\n\t\u274C\t ").concat(status_1.results.malicious, " scanners marked the file as **Malicious**.\n\n\nhttps://www.virustotal.com/gui/file/").concat(status_1.md5, "\n\n**Download this file at your own risk, Do not run arbitrary code on your computer unless you fully understand it**\n\t\t\t\t\t"));
                            return [3 /*break*/, 7];
                        case 6:
                            e_2 = _a.sent();
                            console.error('UNABLE TO GET STATUS');
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
        }
        return [2 /*return*/];
    });
}); });
