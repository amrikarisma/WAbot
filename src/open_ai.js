const axios = require('axios');
const { OPEN_AI_KEY } = require('../config');

const OpenAIHandler = async (text, msg) => {

    const cmd = text.substring(0, text.indexOf(' '));

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik *#tanya<spasi>pertanyaanmu*');
    }

    msg.reply('tunggu bentar ya...');

    const question = text.substring(text.indexOf(' ') + 1);;
    const response = await ChatGPTRequest(question)

    if (!response.success) {
        return msg.reply('Ada yang salah. Coba lagi nanti.');
    }

    return msg.reply(response.data);
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