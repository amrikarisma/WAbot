const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { OpenAIHandler } = require('./src/open_ai');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {

    const text = msg.body.toLowerCase() || '';

    if (text === '!ping') {
        msg.reply('pong');
    }

    if (text.includes("#tanya ") || text.includes("#ask ")) {
        await OpenAIHandler(client, msg);
    }

});

client.initialize();