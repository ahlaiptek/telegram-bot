class Kuis {
    constructor(data) {
        console.log(data)
        this.question = data["Pertanyaan"];
        this.options = [
            data["Opsi 1"],
            data["Opsi 2"],
            data["Opsi 3"],
            data["Opsi 4"],
        ];
        this.topic = data["Topik\r"];
        this.answer = parseInt(data["Jawaban"]);
    }
}

module.exports = {
    Kuis
}