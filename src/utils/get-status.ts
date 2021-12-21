import { Message, MessageAttachment } from 'discord.js';
// @ts-ignore
import nvt from 'node-virustotal';

interface STATUS {
	results: {
		harmless: number;
		suspicious: number;
		malicious: number;
	};

	// hashes
	sha256: string;
	md5: string;
	sha1: string;

	// details
	name: string;
	type: string;
	url: string;
}

export default (id: string, msg: Message<boolean>, a: MessageAttachment) => {
	// this is dumb
	// i just go 10 times until it works

	return new Promise<STATUS>(async (resolve, rej) => {
		let mess = await msg.reply('Analyzing...');
		const instance = nvt.makeAPI();
		instance.setKey(process.env.VIRUSTOTAL || '');

		instance.fileLookup(id, (err: any, res: any) => {
			if (err) {
				console.error(err);
				rej();
			} else {
				// let f = createWriteStream(`${__dirname}/out/bruh.json`);
				// f.write(res);
				// f.close();

				let r = JSON.parse(res).data.attributes.last_analysis_results;
				let h = JSON.parse(res).data.attributes;

				let n = { safe: 0, sus: 0, mal: 0 };

				Object.keys(r).forEach((a) => {
					switch (r[a].category) {
						case 'harmless':
						case 'undetected':
							n.safe += 1;
							break;
						case 'suspicious':
							n.sus += 1;
							break;
						case 'malicious':
							n.mal += 1;
							break;
						default:
							n.safe += 1;
							break;
					}
				});

				// console.log({ r });

				let bruh: STATUS = {
					results: {
						harmless: n.safe,

						suspicious: n.sus,

						malicious: n.mal,
					},

					name: a.name || 'unknown',
					type: a.contentType || 'application/octet-stream',
					url: a.proxyURL,

					md5: h.md5,
					sha256: h.sha256,
					sha1: h.sha1,
				};

				console.log(r);
				console.log(bruh);

				mess.delete();
				resolve(bruh);
			}
		});
	});
};
