import { Message, MessageAttachment } from 'discord.js';
// @ts-ignore
import { XMLHttpRequest } from 'xmlhttprequest';

interface STATUS_REPORT {
	safe: number;
	sus: number;
	malicious: number;
}

export default (id: string, msg: Message<boolean>, a: MessageAttachment) => {
	// this is dumb
	// i just go 10 times until it works

	return new Promise<void>((res, rej) => {
		let i = 0;

		let interval = setInterval(() => {
			i += 1;
			if (i > 10) {
				clearInterval(interval);
				rej();
				return;
			}

			let xhr = new XMLHttpRequest();

			xhr.onreadystatechange = () => {
				if (xhr.readyState === xhr.DONE) {
					let r = JSON.parse(xhr.responseText);

					if (r.error) {
						console.log(`FAILED ATTEMPT ${i} TO GET STATUS`);
						console.log(r);
						return;
					}

					clearInterval(interval);

					msg.reactions.removeAll();

					let results: STATUS_REPORT = {
						malicious:
							r.data.attributes['last_analysis_stats'][
								'malicious'
							],
						safe:
							r.data.attributes['last_analysis_stats'][
								'harmless'
							] +
							r.data.attributes['last_analysis_stats'][
								'undetected'
							],
						sus: r.data.attributes['last_analysis_stats'][
							'suspicious'
						],
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
						msg.reply(
							`=== **Virustotal Report** ===\n  **File**: ${a.name}\n  **Hash**: ${id}\n  **URL**: https://virustotal.com/gui/url/${id}?nocache=1\n\n  ✅ ${results.safe} Scanners Marked it as Harmless\n  ❔ ${results.sus} Scanners Marked it as Suspicious\n  ❌ ${results.malicious} Scanners Markes it as Malicious`
						)
							.then((m) => m.removeAttachments())
							.then(() => {
								res();
							});
					} catch (e) {
						console.error(e);
					}
				}
			};

			xhr.open('GET', `https://www.virustotal.com/api/v3/files/${id}`);
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('x-apikey', process.env.VIRUSTOTAL);
			xhr.send();
		}, 1000);
	});
};
