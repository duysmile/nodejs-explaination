const fs = require('fs');
const { Readable } = require('stream');

class MyStream extends Readable {
    constructor(options) {
        super(options);
        this.readIndex = 0;
    }

    _read(size) {
        let okToSend = true;
        while (okToSend) {
            okToSend = this.push("a" + this.readIndex);
            this.readIndex += size;

            if (this.readIndex > 10000000) {
                this.push(null);
                okToSend = false;
            }
        }
    }
}

(() => {
    const readStream = new MyStream({ highWaterMark: 1 });

    const writeStream = fs.createWriteStream("stream.txt", {
        encoding: "utf8",
        highWaterMark: 1,
    });

    // let begin = 0;
    // function pushData() {
    //     for (let i = begin; i < 10000000; i++) {
    //         readStream.push("a" + i);
    //     }
    //     readStream.push(null);
    // }

    readStream.pipe(writeStream);

    // pushData();

    console.log("DONE");
})()
