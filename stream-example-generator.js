const fs = require('fs');
const { Readable } = require('stream');

(() => {

    const writeStream = fs.createWriteStream("stream.txt", {
        encoding: "utf8",
        highWaterMark: 1,
    });

    let begin = 0;
    async function * generate() {
        for (let i = begin; i < 10000000; i++) {
            yield "a" + i;
        }
    }
    const readStream = Readable.from(generate());

    readStream.pipe(writeStream);

    console.log("DONE");
})()
