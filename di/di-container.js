
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

class DIContainer {
    constructor() {
        this.dependencies = {};
        this.factories = {};
    }

    register(name, dependency) {
        this.dependencies[name] = dependency;
    }

    factory(name, factory) {
        this.factories[name] = factory;
    }

    get(name) {
        if (!this.dependencies[name]) {
            const factory = this.factories[name];
            this.dependencies[name] = factory && this.inject(factory);
            if (!this.dependencies[name]) {
                throw new Error(`cannot find module ${name}`);
            }
        }

        return this.dependencies[name];
    }

    inject(factory) {
        const args = getParamNames(factory);
        const dependencies = args.map(d => this.get(d));

        return factory.apply(null, dependencies);
    }
}

module.exports = DIContainer;