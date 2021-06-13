const express = require('express');

const app = express();

app.get("/", (_, res) => {
    setTimeout(() => {
        res.send("OK")
    }, 200);
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});
