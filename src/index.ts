// load up dotenv

import {
	Client,
	Intents,
	// Message,
	MessageAttachment,
	// MessageFlags,
} from 'discord.js';
import { config } from 'dotenv';

import uploadUrl from './utils/upload-url';
import getStatus from './utils/get-status';

// @ts-ignore
// globalThis.fetch = fetch;

let client: Client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
	],
});

// let virustotal = new VirusTotalApi(process.env.VIRUSTOTAL!);

const SUS_TYPES = [
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
config();
// check if it has the required keys
if (!process.env.DISCORD || !process.env.VIRUSTOTAL) {
	// error out problems
	console.error(
		'❌ No Keys for Discord OR Virustotal, unable to init application'
	);
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
} catch (e) {
	console.error('❌ Failed to login to discord');
	process.exit(2);
}
console.info('✅ Logged into Discord');

// complete init checking

// Initialise event listeners

client.on('ready', () => {
	console.log(`✅ Logged into Discord as '${client.user?.tag}'`);
	console.info('✅ Ready');
});

client.on('messageCreate', async (msg) => {
	// the bot shouldn't respond to itself
	if (msg.author.tag == client.user?.tag) return;

	if (msg.attachments.size > 0) {
		let is_sus = false;
		msg.attachments.forEach((a: MessageAttachment) => {
			if (SUS_TYPES.includes(a.contentType!)) {
				is_sus = true;
			}
		});

		if (!is_sus) {
			msg.react('✅');
			return;
		}

		msg.attachments.forEach(async (a) => {
			// a.setSpoiler();
			msg.react('❔');

			let id: string;

			try {
				id = await uploadUrl(
					a.url,
					a.name || 'unnamed-file',
					a.contentType || 'application/octet-stream',
					msg
				);
			} catch (e) {
				console.error('UNABLE TO UPLOAD URL');
			}

			try {
				if (!id!) {
					msg.reply('UNABLE TO GET VIRUS SCAN RESULTS');
					return;
				}
				let status = await getStatus(id!, msg, a);

				msg.reply(`\
=== **VIRUSTOTAL REPORT** ===
**File Details**
\t*Name*: \t${status.name}
\t*Type*:\t${status.type}
\t*URL*: \t${status.url}

\t*SHA-256*: \t\`${status.sha256}\`
\t*SHA-1*: \t\`${status.sha1}\`
\t*MD5*: \t\`${status.md5}\`

**Scan Results**
\t✅\t ${status.results.harmless} scanners marked the file as **Harmless** or were unable to detect any malware.
\t❔\t ${status.results.suspicious} scanners marked the file as **Suspicious**.
\t❌\t ${status.results.malicious} scanners marked the file as **Malicious**.


https://www.virustotal.com/gui/file/${status.md5}

**Download this file at your own risk, Do not run arbitrary code on your computer unless you fully understand it**
					`);
			} catch (e) {
				console.error('UNABLE TO GET STATUS');
			}
		});
	}
});
