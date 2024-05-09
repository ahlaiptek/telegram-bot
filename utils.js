function convertToJson(csv) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");
    lines.forEach((line) => {
        const obj = {};
        const currentLine = line.split(",");
        headers.forEach((header, index) => {
            obj[header] = currentLine[index].trim();
        });
        result.push(obj);
    });

    result.shift();

    return result;
};

async function get_spreadsheet(url) {
    const response = await fetch(url);
    const csv = await response.text();
    const json = convertToJson(csv);
    return json;
}

module.exports = {
    get_spreadsheet
}