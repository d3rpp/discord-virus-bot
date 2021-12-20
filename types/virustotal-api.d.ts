declare module 'virustotal-api' {
	export default class VirusTotal {
		fileScan(file: string) {
			throw new Error('Method not implemented.');
		}
		urlScan() {
			throw new Error('Method not implemented.');
		}
		constructor(api_key: string);
	}
}
