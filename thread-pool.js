const fs = require('fs');
const crypto = require('crypto');
const http = require('http');

process.env.UV_THREADPOOL_SIZE = 5

const start = Date.now();

function getTime(start) {
    return ((Date.now() - start) / 1000) + "s"
}

function request() {
    return new Promise(resolve => {
        http.request("http://localhost:3000", res => {
            res.on('data', () => {})
            res.on('end', () => {
                console.log('Request --> ', getTime(start))
                resolve();
            })
        }).end();
    });
}

function readFile() {
    return new Promise(resolve => {
        fs.readFile('text.txt', 'utf8', () => {
            console.log('Read file --> ', getTime(start))
            resolve();
        })
    })
}

function hash() {
    return new Promise(resolve => {
        crypto.pbkdf2("some", "thing", 100000, 512, 'sha512', () => {
            console.log('Hash --> ', getTime(start))
            resolve();
        })
    })
}

Promise.all([
    // readFile(),
    hash(1),
    hash(2),
    hash(3),
    hash(4),
    request(5),
    request(6),
    request(7),
    request(8),
    request(9),
    request(10),
    request(11),
    request(12),
    request(13),
])
