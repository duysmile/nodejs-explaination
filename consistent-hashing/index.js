const ConsistentMap = require('./consistent-map');

const consistentMap = new ConsistentMap(2);

const nodes = [
    "Node1", "Node2", "Node3"
];

for (const node of nodes) {
    consistentMap.registerServer(node);
}

const tasks = [
    "A_replica_0",
    "B_replica_0",
    "C_replica_0",
    "D_replica_0",
    "E_replica_0",
    "F_replica_0",
    "G_replica_0",
];

// consistentMap.unregisterServer(nodes[0]);

for (const task of tasks) {
    console.log(`Task ${task} with hashCode ${consistentMap.getInstanceHashCode(task, 0)} run on server ${consistentMap.getServer(task)}`);
}


consistentMap.unregisterServer(nodes[0])
console.log("After unregister Node1");

for (const task of tasks) {
    console.log(`Task ${task} with hashCode ${consistentMap.getInstanceHashCode(task, 0)} run on server ${consistentMap.getServer(task)}`);
}