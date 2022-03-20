class Node {
    constructor(value) {
        this.value = value;
        this.side = null;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.meta = {};
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    set left(node) {
        this._left = node;
        if (node) {
            node.side = 'left';
            node.parent = this;
        }
    }

    set right(node) {
        this._right = node;
        if (node) {
            node.side = 'right';
            node.parent = this;
        }
    }

    get height() {
        return Math.max(this.leftSubtreeHeight, this.rightSubtreeHeight);
    }

    get leftSubtreeHeight() {
        return this.left ? this.left.height + 1 : 0;
    }

    get rightSubtreeHeight() {
        return this.right ? this.right.height + 1 : 0;
    }

    get balanceFactor() {
        return this.leftSubtreeHeight - this.rightSubtreeHeight;
    }
}

function leftRotation(node) {
    const newParent = node.right;
    const grandParent = node.parent;
    const previousLeft = newParent.left;

    swapParentChild(node, newParent, grandParent);

    newParent.left = node;
    node.right = previousLeft;

    return newParent;
}

function rightRotation(node) {
    const newParent = node.left;
    const grandParent = node.parent;
    const previousRight = newParent.right;

    swapParentChild(node, newParent, grandParent);

    newParent.right = node;
    node.left = previousRight;
    return newParent;
}

function leftRightRotation(node) {
    leftRotation(node.left);
    return rightRotation(node);
}

function rightLeftRotation(node) {
    rightRotation(node.right);
    return leftRotation(node);
}

function swapParentChild(oldChild, newChild, parent) {
    if (parent) {
        const side = oldChild.side;
        parent[side] = newChild;
    } else {
        newChild.parent = null;
    }
}

function balance(node) {
    if (node.balanceFactor > 1) {
        if (node.left.balanceFactor < 0) {
            return leftRightRotation(node);
        }

        return rightRotation(node);
    } else if (node.balanceFactor < -1) {
        if (node.right.balanceFactor > 0) {
            return rightLeftRotation(node);
        }
        return leftRotation(node);
    }
    return node;
}

function balanceUpstream(node) {
    let current = node;
    let newParent;
    while (current) {
        newParent = balance(current);
        current = current.parent;
    }
    return newParent;
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    add(value) {
        const newNode = new Node(value);
        if (this.root) {
            const { found, parent } = this.findNodeAndParent(value);
            if (found) {
                // duplicated value in this tree
                found.meta.multiplicity = (found.meta.multiplicity || 1) + 1;
            } else if (value < parent.value) {
                parent.left = newNode;
            } else {
                parent.right = newNode;
            }
        } else {
            this.root = newNode;
        }

        this.size += 1;
        return newNode;
    }

    findNodeAndParent(value) {
        let node = this.root;
        let parent;

        while (node) {
            if (node.value === value) {
                break;
            }
            parent = node;
            node = (value >= node.value) ? node.right : node.left;
        }

        return { found: node, parent };
    }

    find(value) {
        let node = this.root;
        while (node) {
            if (node.value === value) {
                return node;
            } else if (node.value > value) {
                node = node.left;
            } else {
                node = node.right;
            }
        }

        return null;
    }

    remove(value) {
        const nodeToRemove = this.find(value);
        if (!nodeToRemove) return false;

        const nodeToRemoveChildren = this.combineLeftIntoRightSubtree(nodeToRemove);

        if (nodeToRemove.meta.multiplicity && nodeToRemove.meta.multiplicity > 1) {
            nodeToRemove.meta.multiplicity -= 1;
        } else if (nodeToRemove == this.root) {
            this.root = nodeToRemoveChildren;
            this.root.parent = null;
        } else {
            const side = nodeToRemove.side;
            const { parent } = nodeToRemove;
            parent[side] = nodeToRemoveChildren;
        }

        this.size -= 1;
        return true;
    }

    combineLeftIntoRightSubtree(node) {
        if (!node) {
            return node;
        }

        if (node.right) {
            const leftmost = this.getLeftmost(node.right);
            leftmost.left = node.left;
            return node.right;
        }

        return node.left;
    }

    getLeftmost(node) {
        let temp = node
        while (temp && temp.left) {
            temp = temp.left;
        }

        return temp;
    }

    print() {
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
                console.log(`${n.value} has left: ${n.left?.value} and right: ${n.right?.value}`);
            }

            console.log("===================");
        }
    }
}

class AVLTree extends BinarySearchTree {
    add(value) {
        const node = super.add(value);
        this.root = balanceUpstream(node);
        return node;
    }

    remove(value) {
        const node = super.find(value);
        if (node) {
            const found = super.remove(value);
            this.root = balanceUpstream(node.parent);
            return found;
        }

        return false;
    }
}

class TreeMap {
    constructor() {
        // implement binary tree to keep all keys in sorted
        this.tree = new AVLTree();
        // implement map to store value
        this.map = {};
    }

    isEmpty() {
        return this.tree.size == 0;
    }

    firstEntry() {
        const node = this.tree.getLeftmost(this.tree.root);
        return this.map[node.value];
    }

    set(key, value) {
        this.map[key] = value;
        this.tree.add(key);
    }

    remove(key) {
        delete this.map[key];
        this.tree.remove(key);
    }

    getCeilingEntry(value) {
        let node = this.tree.root;
        while (node) {
            if (node.value < value) {
                node = node.right;
            } else {
                return this.map[node.value];
            }
        }

        return null;
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
