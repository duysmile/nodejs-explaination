const express = require('express');

const app = express();

app.get("/ping", (_, res) => {
    res.send("pong");
})

app.get("/block", (_, res) => {
    let data = 0;
    for (let i = 0; i < 1e11; i++) {
        data += 1;
    }
    res.send("" + data);
});

app.get("/unblock-with-timeout", (_, res) => {
    let data = 0;
    countTimeout(data, res.send);
});

app.get("/unblock-with-immediately", async (_, res) => {
    let data = 0;
    for (let i = 0; i < 1e8; i++) {
        data += 1;
        await countImmediately();
    }
    res.send("" + data);
});

// Split CPU-hungry tasks
function countTimeout(data, callback) {
    setTimeout(() => {
        for (let i = 0; i < 1e5; i++) {
            data++;
        }
        if (data == 1e11) {
            callback(data);
        } else {
            countTimeout(data, callback);
        }
    }, 0, data);
}

function countImmediately() {
    return new Promise(res => {
        setImmediate(() => res());
    });
}

app.listen(3000, () => {
    console.log("Server started at port 3000");
});
