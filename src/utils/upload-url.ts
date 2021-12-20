// @ts-ignore
import fetch from 'node-fetch';
import FormData from 'form-data';
import download from 'download';

export default (url: string) => {
	return new Promise<string>(async (res, rej) => {
		const data = new FormData();
		// TODO: formatting of name
		data.append(
			'file',
			(
				await download(url, {
					headers: { Accept: '*/*' },
					method: 'GET',
				})
			).toString('binary')
		);

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'x-apikey': process.env.VIRUSTOTAL,
				'Content-Type':
					'multipart/form-data; boundary=---011000010111000001101001',
			},
		};

		// @ts-ignore
		options.body = data;

		fetch('https://www.virustotal.com/api/v3/files', options)
			.then((j) => j.json())
			.then((re: any) => {
				console.log(re);
				if (re.error) {
					rej();
					return;
				}
				res(re.data.id);
			});
	});
};
