require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { initializeCommands } = require("./commands");

const token = process.env.KEY;

const bot = new TelegramBot(token, { polling: true });

initializeCommands(bot);
