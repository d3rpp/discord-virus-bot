// @ts-ignore
import download from 'download';
import { readFileSync, rmSync } from 'fs';
import { Message } from 'discord.js';
// @ts-ignore
import nvt from 'node-virustotal';

export default (url: string, name: string, mime: string, message: Message) => {
	return new Promise<string>(async (resolve, rej) => {
		let mess = await message.reply(
			"That's a sussy file type, imma check that"
		);

		await download(url, `${__dirname}/tmp`);

		const instance = nvt.makeAPI();
		instance.setKey(process.env.VIRUSTOTAL || '');

		instance.uploadFile(
			readFileSync(`${__dirname}/tmp/${name}`),
			name,
			mime,
			async (err: any, res: any) => {
				if (err) {
					console.error(err);
					rej();
				}

				if (res) {
					console.info(res);
					resolve(atob(JSON.parse(res).data.id).split(':')[0]);
				}

				await mess.delete();
				rmSync(`${__dirname}/tmp/${name}`);
			}
		);
	});
};
