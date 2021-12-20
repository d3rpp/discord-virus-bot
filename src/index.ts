// load up dotenv

import { Client, Intents, Message, MessageFlags } from 'discord.js';
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
];

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
});

client.on('messageCreate', async (msg) => {
	// the bot shouldn't respond to itself
	if (msg.author.tag == client.user?.tag) return;

	if (msg.attachments.size > 0) {
		let is_sus = false;
		msg.attachments.forEach((a) => {
			if (SUS_TYPES.includes(a.contentType!)) {
				is_sus = true;
			}
		});

		if (!is_sus) {
			msg.react('✅');
			return;
		}

		msg.attachments.forEach(async (a) => {
			if (SUS_TYPES.includes(a.contentType!)) {
				// a.setSpoiler();
				msg.react('❔');

				let id: string;

				try {
					id = await uploadUrl(a.url);
				} catch (e) {
					console.error('UNABLE TO UPLOAD URL');
				}

				try {
					if (!id!) {
						msg.reply('UNABLE TO GET VIRUS SCAN RESULTS');
						return;
					}
					await getStatus(id!, msg, a);
				} catch (e) {
					console.error('UNABLE TO GET STATUS');
				}
			}
		});
	}
});

console.info('✅ Ready');
