const TreeMap = require('./treemap');

class ConsistentMap {

    constructor(
        replicas,
        algorithm,
    ) {
        this.replicas = replicas || 4;
        this.algorithm = algorithm || 'md5';

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
            return server.firstEntry();
        }

        return server;
    }

    // register server to system
    registerServer(server) {
        this.servers.set(this.hashcode(server), server);
    }

    unregisterServer(server) {
        this.servers.remove(this.hashcode(server));
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
        return this.hashcode(`${server}-replica-${i}`);
    }

    getRingLength() {
        return Object.keys(this.ring).length;
    }
}


module.exports = ConsistentMap;
