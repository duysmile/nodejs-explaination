const ConsistentMap = require('./consistent-map');

const consistentMap = new ConsistentMap(5);

const nodes = [
    "Node1", "Node2", "Node3"
];

for (const node of nodes) {
    consistentMap.registerServer(node);
}

const tasks = [
    "A", "B", "C", "D", "E", "F", "G",
];

// consistentMap.unregisterServer(nodes[0]);

for (const task of tasks) {
    console.log(`Task ${task} run on server ${consistentMap.getServer(task)}`);
}
