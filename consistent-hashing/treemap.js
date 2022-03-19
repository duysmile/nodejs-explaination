class Node {
    constructor(value) {
        this.value = value;
        this.side = null;
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    add(side, node) {
        if (side != 'left' && side != 'right') {
            throw new Error('Side must be left or right');
        }
        this[side] = node;
        node.side = side;
        node.parent = this;
    }
}

function leftRotation(node) {
    const newParent = node.right;
    const grandParent = node.parent;

    swapParentChild(node, newParent, grandParent);

    newParent.left = node;
    node.right = undefined;
    return newParent;
}

function rightRotation(node) {
    const newParent = node.left;
    const grandParent = node.parent;

    swapParentChild(node, newParent, grandParent);

    newParent.right = node;
    node.left = undefined;
    return newParent;
}

function swapParentChild(oldChild, newChild, parent) {
    if (parent) {
        const side = oldChild.side;
        parent.add(side, newChild);
    } else {
        newChild.parent = null;
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
            root.add('left', this.addNodeToTree(root.left, newNode));
        } else if (root.value < newNode.value) {
            root.add('right', this.addNodeToTree(root.right, newNode));
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

module.exports = TreeMap;
