setTimeout(() => console.log('A'), 0);
console.log('B');
console.log('start', Date.now());
setTimeout(() => console.log('End', Date.now()), 1000);
setTimeout(() => console.log('D'), 0);

for (let i = 0; i < 100000000000; i++) {
    Math.sqrt(i);
}

console.log('Finish blocking', Date.now());
