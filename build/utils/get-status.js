"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var xmlhttprequest_1 = require("xmlhttprequest");
exports.default = (function (id, msg, a) {
    // this is dumb
    // i just go 10 times until it works
    return new Promise(function (res, rej) {
        var i = 0;
        var interval = setInterval(function () {
            i += 1;
            if (i > 10) {
                clearInterval(interval);
                rej();
                return;
            }
            var xhr = new xmlhttprequest_1.XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === xhr.DONE) {
                    var r = JSON.parse(xhr.responseText);
                    if (r.error) {
                        console.log("FAILED ATTEMPT ".concat(i, " TO GET STATUS"));
                        console.log(r);
                        return;
                    }
                    clearInterval(interval);
                    msg.reactions.removeAll();
                    var results = {
                        malicious: r.data.attributes['last_analysis_stats']['malicious'],
                        safe: r.data.attributes['last_analysis_stats']['harmless'] +
                            r.data.attributes['last_analysis_stats']['undetected'],
                        sus: r.data.attributes['last_analysis_stats']['suspicious'],
                    };
                    // let keys = Object.keys(
                    // 	r.data.attributes.last_analysis_results
                    // );
                    // keys.forEach((a) => {
                    // 	switch (
                    // 		r.data.attributes.last_analysis_results[a].category
                    // 	) {
                    // 		case 'harmless':
                    // 			results.safe += 1;
                    // 			break;
                    // 		case 'suspicious':
                    // 			results.sus += 1;
                    // 			break;
                    // 		case 'malicious':
                    // 			results.malicious += 1;
                    // 			break;
                    // 		default:
                    // 			break;
                    // 	}
                    // });
                    try {
                        msg.reply("=== **Virustotal Report** ===\n  **File**: ".concat(a.name, "\n  **Hash**: ").concat(id, "\n  **URL**: https://virustotal.com/gui/url/").concat(id, "?nocache=1\n\n  \u2705 ").concat(results.safe, " Scanners Marked it as Harmless\n  \u2754 ").concat(results.sus, " Scanners Marked it as Suspicious\n  \u274C ").concat(results.malicious, " Scanners Markes it as Malicious"))
                            .then(function (m) { return m.removeAttachments(); })
                            .then(function () {
                            res();
                        });
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            };
            xhr.open('GET', "https://www.virustotal.com/api/v3/files/".concat(id));
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('x-apikey', process.env.VIRUSTOTAL);
            xhr.send();
        }, 1000);
    });
});
