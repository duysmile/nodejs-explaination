const TreeMap = require('./treemap');

class ConsistentMap {

    constructor(replicas) {
        this.replicas = replicas || 4;
        this.servers = new TreeMap();
    }

    // get server to execute task
    getServer(task) {
        if (this.servers.isEmpty()) {
            throw new Error("no server to execute task");
        }

        const hash = this.hashcode(task);
        let server = this.servers.getCeilingEntry(hash);
        if (!server) {
            return this.servers.firstEntry();
        }

        return server;
    }

    // register server to system
    registerServer(server) {
        for (let i = 0; i < this.replicas; i++) {
            this.servers.set(this.getInstanceHashCode(server, i), server);
        }
    }

    unregisterServer(server) {
        for (let i = 0; i < this.replicas; i++) {
            this.servers.remove(this.getInstanceHashCode(server, i));
        }
    }

    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    hashCode(input) {
        let hash = 0;

        let i = 0;
        const length = input.length;
        while (i < length) {
            hash = ((hash << 5) - hash + input.charCodeAt(i++)) | 0;
        }

        return hash;
    }

    // get positive hash value
    hashcode(input) {
        return this.hashCode(input) + 2 ** 32 - 1;
    }

    getInstanceHashCode(server, i) {
        return this.hashcode(`${server}_replica_${i}`);
    }
}

module.exports = ConsistentMap;
