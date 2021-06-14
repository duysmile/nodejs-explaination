const express = require('express');

const app = express();

app.get("/", (_, res) => {
    setTimeout(() => {
        let data = "";
        for (let i = 0; i < 10000; i++) {
            data += "abc123123123123123123123";
        }
        res.send(data);
    }, 200);
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});
