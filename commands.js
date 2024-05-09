require("dotenv").config();
const utils = require("./utils");
const { Kuis } = require("./models");

// Tangani perintah "/start"
function handleStart(msg, bot) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Halo! Saya adalah bot Anda yang baru. Silakan kirimkan pesan kepada saya.");
}

// Tangani perintah "/about"
function handleAbout(msg, bot) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Saya adalah bot Anda yang baru. Silakan kirimkan pesan kepada saya. Dan tetap semangat!");
}

// Tangani perintah "/ibnu_aqil"
async function handleQuiz(msg, bot, url) {
    let quiz = await utils.get_spreadsheet(url);
    for (let i = 0; i < quiz.length; i++) {
        quiz[i] = new Kuis(quiz[i]);
    }

    const chatId = msg.chat.id;

    // Menampilkan opsi topik
    let question = "Pilih topik: ";
    let options = quiz.map(item => item.topic);
    bot.sendMessage(chatId, question, {
        reply_markup: {
            keyboard: options.map(option => [{ text: option }]),
            one_time_keyboard: true,
            resize_keyboard: true
        }
    });

    bot.once('message', async (callback) => {
        for (let i = 0; i < options.length; i++) {
            if (options[i] == callback.text) {
                quiz = quiz.filter(function(check) {
                    return check.topic == options[i];
                });

                // Random
                quiz.sort(() => Math.random() - 0.5);
                quiz = quiz[0];
                console.log(quiz)

                question = quiz.question;
                options = quiz.options;
                console.log(options)
                await bot.sendMessage(chatId, question, {
                    reply_markup: {
                        keyboard: options.map(option => [{ text: option }]),
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                });

                // jawaban
                bot.once('message', (callback) => {
                    const index = options.indexOf(callback.text) + 1;
                    // Handle the answer here

                    if (index == quiz.answer) {
                        bot.sendMessage(chatId, 'Selamat, jawaban anda benar!');
                    } else {
                        bot.sendMessage(chatId, 'Maaf, jawaban anda salah!');
                        bot.sendMessage(chatId, 'Jawaban yang benar adalah:\n' + quiz.options[quiz.answer - 1]);
                    }
                });
            }
        }
    });
}

function handleIbnuAqil(msq, bot, url) {
    handleQuiz(msq, bot, url)
}


// Tangani perintah "/help"
function handleHelp(msg, bot) {
    const chatId = msg.chat.id;
    // Daftar perintah yang tersedia
    const commands = [
        "/start - Memulai bot",
        "/help - Menampilkan daftar perintah",
        "/about - Menampilkan informasi tentang bot",
        "/ibnu_aqil",
        "/tafsir_munir"
        // Tambahkan perintah lain di sini
    ];
    // Gabungkan daftar perintah menjadi satu pesan dengan baris baru
    const helpMessage = commands.join("\n");
    // Kirim pesan bantuan
    bot.sendMessage(chatId, "Berikut adalah daftar perintah yang tersedia:\n" + helpMessage);
}

// Inisialisasi fungsi-fungsi perintah
function initializeCommands(bot) {
    bot.onText(/\/start/, (msg) => handleStart(msg, bot));
    bot.onText(/\/about/, (msg) => handleAbout(msg, bot));
    bot.onText(/\/help/, (msg) => handleHelp(msg, bot));
    bot.onText(/\/ibnu_aqil/, (msg) => handleIbnuAqil(msg, bot, process.env.IBNU_AQIL));
    bot.onText(/\/tafsir_munir/, (msg) => handleIbnuAqil(msg, bot, process.env.TAFSIR_MUNIR));
}
module.exports = { initializeCommands };
