const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN
const TELEGRAM_URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/setWebHook";
const WEBHOOK_URL = process.env.WEBHOOK_URL

// Setting up webhook for Telegram Bot so that all updates to the bot, are handled by the "TELEGRAM_URL" and updated on Notion
async function setWebhook() {
    const response = await axios.post(TELEGRAM_URL, {
        url: WEBHOOK_URL,
        allowed_updates: ["message","edited_message","channel_post","edited_channel_post"]
    });
    console.log(response.data);
}

setWebhook();