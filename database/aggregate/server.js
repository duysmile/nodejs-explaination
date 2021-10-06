const express = require('express');
const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017';
const MONGO_DB = 'test';

const MONGO_COLLECTION = 'campaign-customers';

const mongoClient = new MongoClient(MONGO_URL, {
    useUnifiedTopology: true,
    maxPoolSize: 10,
    maxIdleTimeMS: 10000,
});

const app = express();

const db = mongoClient.db(MONGO_DB);

app.get('/ping', (_, res) => {
    res.send('pong');
});

app.get('/aggregate', async (_, res) => {
    // const start = Date.now();
    const data = await db.collection(MONGO_COLLECTION).aggregate([
        { $match: { isActived: 1 } },
        { $group: { _id: "$phone", total: { $sum: "$isActived" } } },
    ]).toArray();

    // console.log(data);
    // console.log(`Aggregate took ${Date.now() - start}ms`);
    res.send('OK');
});

app.get('/logic', async (_, res) => {
    // const start = Date.now();
    const condition = {
        isActived: 1,
    };

    const batchSize = 500000;
    let result = {};
    let data = [];
    let lastId;

    do {
        if (lastId) {
            condition._id = {
                $gt: lastId,
            };
        }
        data = await db.collection(MONGO_COLLECTION)
            .find(condition)
            .sort({ _id: 1 })
            .project({ phone: 1, isActived: 1 })
            .limit(batchSize)
            .toArray();


        lastId = data[data.length - 1]._id;

        result = data.reduce((acc, value) => {
            const { phone, isActived } = value;
            if (!acc[phone]) {
                acc[phone] = 0;
            }
            acc[phone] += isActived;
            return acc;
        }, result);

    } while (data.length >= batchSize);

    // console.log(`Logic took ${Date.now() - start}ms`);
    // console.log(result);
    res.send('OK');
});

mongoClient.connect().then(() => {
    app.listen(3000, () => {
        console.log('Server started at port 3000');
    });
});
