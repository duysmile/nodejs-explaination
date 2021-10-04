const { MongoClient } = require('mongodb');
const Bulker = require('./bulker');

const MONGO_URI = 'mongodb://localhost:27017';
const MONGO_DB = 'test';

const NUMBER_OF_LOOP = 100000;
const INSERT_SIZE = 100000;
const INSERT_GROUP_CHUNK_SIZE = 100;
const ENDPOINT = process.argv[2];

const mongoClient = new MongoClient(MONGO_URI, {
    useUnifiedTopology: true,
    maxPoolSize: 5, // set equal to max ccu to avoid waiting for create new connection
    maxIdleTimeMS: 10000,
});

const db = mongoClient.db(MONGO_DB);

async function run() {
    let counter = 0;
    const start = Date.now();
    async function insert(body) {
        await db.collection('messages')
            .insertOne(body)
            .then(() => {
                counter += 1;
                if (counter == NUMBER_OF_LOOP) {
                    const took = Date.now() - start;
                    console.log(
                        `Took ${took}ms
                         Avg: ${NUMBER_OF_LOOP / took * 1000} / s
                        `
                    )
                }
            })
    }

    const data = {
        userId: '0905205537',
        text: 'xin chào mình là Duy',
    };

    switch (ENDPOINT) {
        case 'insert_sync': {
            for (let i = 0; i < NUMBER_OF_LOOP; i++) {
                await insert({ ...data });
            }
            break;
        }

        case 'insert_async': {
            for (let i = 0; i < NUMBER_OF_LOOP; i++) {
                insert({ ...data });
            }
            break;
        }

        case 'insert_group': {
            const groupBulker = new Bulker(
                INSERT_SIZE,
                60000,
                async (items) => {
                    let chunk = [];
                    const start = Date.now();
                    for (let i = 0; i < items.length; i++) {
                        await (async function (item) {
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

            for (let i = 0; i < NUMBER_OF_LOOP; i++) {
                groupBulker.push({ ...data });
            }

            setInterval(() => {
                if (groupBulker.getCounter() == NUMBER_OF_LOOP) {
                    const took = Date.now() - start;
                    console.log(
                        `Took ${took}ms
                         Avg: ${NUMBER_OF_LOOP / took * 1000} / s
                        `
                    );
                    process.exit();
                }
            }, 50);
            break;
        }

        case 'insert_bulk': {
            const insertBulker = new Bulker(
                INSERT_SIZE,
                1000,
                async (items) => {
                    await db.collection('messages').insertMany(items);
                }
            );

            for (let i = 0; i < NUMBER_OF_LOOP; i++) {
                insertBulker.push({ ...data });
            }

            setInterval(() => {
                if (insertBulker.getCounter() == NUMBER_OF_LOOP) {
                    const took = Date.now() - start;
                    console.log(
                        `Took ${took}ms
                         Avg: ${NUMBER_OF_LOOP / took * 1000} / s
                        `
                    );
                    process.exit();
                }
            }, 50);
            break;
        }

        default:
            break;
    }
}

mongoClient.connect().then(run);
