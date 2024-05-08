require("dotenv").config()
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.KEY;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    // Kirim pesan balasan
    bot.sendMessage(chatId, "Terima kasih telah mengirim pesan: '" + msg.text + "'");
});

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Halo! Saya adalah bot Anda yang baru. Silakan kirimkan pesan kepada saya.");
});

bot.onText(/\/about/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Saya adalah bot Anda yang baru. Silakan kirimkan pesan kepada saya. Dan tetap semangat!");
});

// Tangani perintah "/help"
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    // Daftar perintah yang tersedia
    const commands = [
        "/start - Memulai bot",
        "/help - Menampilkan daftar perintah",
        "/about - Menampilkan informasi tentang bot",
        // Tambahkan perintah lain di sini
    ];
    // Gabungkan daftar perintah menjadi satu pesan dengan baris baru
    const helpMessage = commands.join("\n");
    // Kirim pesan bantuan
    bot.sendMessage(chatId, "Berikut adalah daftar perintah yang tersedia:\n" + helpMessage);
});
