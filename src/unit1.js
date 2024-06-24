const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();

function getTemp(){
    return 475;
}

function getPressure(){
    return 115;
}

console.info(`module.filename=[${module.filename}]`);
console.info(`module.id=[${module.id}]`);

module.exports = {
    eventEmitter,
    getTemp,
    getPressure
};

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
    module.exports.eventEmitter.emit('ready');
}, 600);
