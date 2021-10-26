const express = require('express');
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
const addToSet = promisify(client.sadd).bind(client);
const removeFromSet = promisify(client.srem).bind(client);

const app = express();
app.post('/actions', async (req, res) => {
    const key = 'actions';
    const uniqueAction = "unique-action";

    const result = await addToSet(key, uniqueAction);

    if (result === 1) {
        console.log('Action ...');
        await new Promise((res) => {
            setTimeout(res, 3000);
        });
        console.log('Done');
        await removeFromSet(key, uniqueAction);
    } else {
        console.log("don't act");
    }

    res.send('OK');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
})
