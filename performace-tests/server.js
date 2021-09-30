const express = require('express');

const app = express();

app.use(express.json());
app.disable('etag');
app.disable('x-powered-by');

app.get('/', (_, res) => {
    res.send('pong');
});

app.post('/', (req, res) => {
    res.send('pong');
});

app.listen(3000, () => {
    console.log('Server started at port 3000');
});
