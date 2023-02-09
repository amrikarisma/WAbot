const axios = require('axios');
const { OPEN_AI_KEY } = require('../config');

const OpenAIHandler = async (client, msg) => {
    const text = msg.body.toLowerCase() || '';
    const cmd = text.substring(0, text.indexOf(' '));

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik *#tanya<spasi>pertanyaanmu*');
    }

    const contact = await msg.getContact();
    const name = contact.pushname

    // client.sendMessage(msg.from, 'Hi, ' + name);
    // await new Promise(r => setTimeout(r, 1000));
    msg.reply('wait...');
    await new Promise(r => setTimeout(r, 2000));
    const question = text.substring(text.indexOf(' ') + 1);;
    const response = await ChatGPTRequest(question)

    if (!response.success) {
        return msg.reply('There is something wrong. Try again later.');
    }

    return msg.reply(response.data.trim());
}


const ChatGPTRequest = async (text) => {

    const result = {
        success: false,
        data: null,
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
            model: "text-davinci-003",
            prompt: text,
            max_tokens: 1000,
            temperature: 0
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${OPEN_AI_KEY}`,
        },
    })
        .then((response) => {
            if (response.status == 200) {
                result.success = true;
                result.data = response?.data?.choices?.[0].text || 'Aku gak tau';
            } else {
                result.message = "Failed";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    OpenAIHandler
}