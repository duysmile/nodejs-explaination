const _ = require('lodash');

module.exports = function(size, timeout, batchFunc) {
    let batch = [];
    let counter = 0;

    const execBatchFunc = async () => {
        const tmp = batch;
        batch = [];

        await batchFunc(tmp);
        counter += tmp.length;
        console.log(`Processed ${tmp.length} records`);
    };

    const throttledFunc = _.throttle(execBatchFunc, timeout, {
        leading: false,
        trailing: true,
    });

    return {
        push(item) {
            batch.push(item);

            if (batch.length >= size) {
                throttledFunc.flush();
            } else {
                throttledFunc();
            }
        },
        getCounter() {
            return counter;
        }
    };
};
