const express = require('express');
const { MongoClient } = require('mongodb');
const Bulker = require('./bulker');

const MONGO_URI = 'mongodb://localhost:27017';
const MONGO_DB = 'test';

const INSERT_SIZE = 100000;
const INSERT_GROUP_CHUNK_SIZE = 100;

const mongoClient = new MongoClient(MONGO_URI, {
    useUnifiedTopology: true,
    maxPoolSize: 5, // set equal to max ccu to avoid waiting for create new connection
    maxIdleTimeMS: 10000,
});

const db = mongoClient.db(MONGO_DB);

const groupBulker = new Bulker(
    INSERT_SIZE,
    60000,
    async (items) => {
        let chunk = [];
        const start = Date.now();
        for (let i = 0; i < items.length; i++) {
            await (async function(item) {
                chunk.push(db.collection('messages').insertOne(item));
                if (i % INSERT_GROUP_CHUNK_SIZE === 0) {
                    await Promise.all(chunk);
                    chunk = [];
                }
            }(items[i]));
        }
        console.log(`Group took ${Date.now() - start} ms`);
    },
);

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

app.post('/insert_sync', async (req, res) => {
    const data = req.body;
    await db.collection('messages')
        .insertOne(data);
    // console.log("OK");
    res.send('OK');
});

let start;
let counter = 0;

app.post('/insert_async', async (req, res) => {
    start = start ? start : Date.now();
    const data = req.body;
    db.collection('messages')
        .insertOne(data).then(() => counter += 1);
    res.send('OK');
});

app.post('/insert_group', async (req, res) => {
    const data = req.body;
    groupBulker.push(data);
    res.send('OK');
});

mongoClient.connect().then(() => {
    app.listen(3000, () => {
        console.log('Server started at port 3000');
    });
});
