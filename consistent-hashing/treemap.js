class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    addLeft(node) {
        this.left = node;
    }

    addRight(node) {
        this.right = node;
    }
}

class TreeMap {
    constructor() {
        // implement binary tree to keep all keys in sorted
        // implement map to store value
        this.root = null;
        this.map = {};
    }

    isEmpty() {

    }

    firstEntry() {

    }

    get(key) {

    }

    set(key, value) {
        this.map[key] = value;
        const newNode = new Node(key);
        this.root = this.addNodeToTree(this.root, newNode);
    }

    addNodeToTree(root, newNode) {
        if (root == null) {
            return newNode;
        }

        if (root.value > newNode.value) {
            root.addLeft(this.addNodeToTree(root.left, newNode));
        } else if (root.value < newNode.value) {
            root.addRight(this.addNodeToTree(root.right, newNode));
        }

        return root;
    }

    remove(key) {
        // remake balance tree
    }

    getCeilingEntry(value) {

    }

    printTreeMap() {
        console.log("Map: ", JSON.stringify(this.map, null, 2));
        console.log("Tree:");

        let nodes = [this.root];

        while (nodes.length > 0) {
            const printNodes = [];
            for (const n of nodes) {
                printNodes.push(n);
            }

            const tmp = [];
            for (const n of nodes) {
                if (n.left) {
                    tmp.push(n.left);
                }
                if (n.right) {
                    tmp.push(n.right);
                }
            }

            nodes = tmp;
            for (let n of printNodes) {
                console.log(`data[${n.value}]: ${this.map[n.value]} has left: ${n.left?.value} and right: ${n.right?.value}`);
            }

            console.log("===================");
        }
    }
}

const treeMap = new TreeMap();

treeMap.set(3, "a");
treeMap.set(2, "b");
treeMap.set(5, "c");
treeMap.set(4, "d");

treeMap.printTreeMap();

module.exports = TreeMap;
