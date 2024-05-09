const os = require("os");

require("dotenv").config();
const utils = require("./utils");
const { Kuis } = require("./models");

// Tangani perintah "/start"
function handleStart(msg, bot) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Halo! Saya adalah bot Anda yang baru. Silakan kirimkan pesan kepada saya.");
}

// Tangani perintah "/device"
function handleDevice(msg, bot) {
    const chatId = msg.chat.id;
    // Format informasi CPU
    const cpuInfo = `CPU Info:
    Model: ${os.cpus()[0].model}
    Cores: ${os.cpus().length}`;

    // Format informasi RAM
    const ramInfo = `RAM Info:
    Total Memory: ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB
    Free Memory: ${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`;

    // Format informasi Sistem Operasi
    const osInfo = `OS Info:
    Type: ${os.type()}
    Platform: ${os.platform()}
    Architecture: ${os.arch()}`;

    // Gabungkan semua informasi menjadi satu string
    const deviceInfo = `${cpuInfo}\n${ramInfo}\n${osInfo}`;
    bot.sendMessage(chatId, deviceInfo);
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
    function removeDuplicates(array) {
        return array.filter((item, index) => array.indexOf(item) === index);
    }
    options = removeDuplicates(options);

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
                bot.sendMessage(chatId, 'Terdapat sebanyak ' + quiz.length + ' data');

                quiz = quiz[0];

                question = quiz.question;
                options = quiz.options;
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

                    bot.sendMessage(chatId, 'Ketika selesai silahkan kembali \n/help');
                });
            }
        }
    });
}

// Tangani perintah "/help"
function handleHelp(msg, bot) {
    const chatId = msg.chat.id;
    // Daftar perintah yang tersedia
    const commands = [
        "/start - Memulai bot",
        "/help - Menampilkan daftar perintah",
        "/about - Menampilkan informasi tentang bot",
        "/device - Menampilkan spesifikasi perangkat",
        "/tematik - Tematik Alquran",
        "/ibnu_aqil",
        "/tafsir_munir",
        "/minhaj_thalibin"
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
    bot.onText(/\/device/, (msg) => handleDevice(msg, bot));
    bot.onText(/\/tematik/, (msg) => handleQuiz(msg, bot, process.env.TEMATIK));
    bot.onText(/\/ibnu_aqil/, (msg) => handleQuiz(msg, bot, process.env.IBNU_AQIL));
    bot.onText(/\/tafsir_munir/, (msg) => handleQuiz(msg, bot, process.env.TAFSIR_MUNIR));
    bot.onText(/\/minhaj_thalibin/, (msg) => handleQuiz(msg, bot, process.env.MINHAJ_THALIBIN));
}
module.exports = { initializeCommands };
