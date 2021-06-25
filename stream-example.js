const fs = require('fs');
const { Readable } = require('stream');

(() => {
    const readStream = new Readable({
        read() {}
    });

    const writeStream = fs.createWriteStream("stream.txt", {
        encoding: "utf8",
        highWaterMark: 1,
    });

    let begin = 0;
    function pushData() {
        for (let i = begin; i < 10000000; i++) {
            if (!readStream.push("a" + i)) {
                return;
            }
        }
        readStream.push(null);
    }

    writeStream.on("drain", () => {
        // pushData();
    });

    readStream.pipe(writeStream);

    pushData();

    console.log("DONE");
})()
