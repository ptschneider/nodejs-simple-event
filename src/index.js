
function showMyEnv(){
    console.info(`__filename=[${__filename}]`);
    console.info(`__dirname=[${__dirname}]`);
    console.info('require.main:');
    console.info(require.main);
    //const {builtinModules: builtin} = require("node:module");
    const builtin = require('node:module').builtinModules;

    console.info(`module.builtinModules=[${builtin}]`);
    console.info(`module.filename=[${module.filename}]`);
    console.info(`module.id=[${module.id}]`);
}

function shutdown(key){
    console.log(`shutdown invoked, key=${key}`);
    const code = key.length > 0 ? 1 : 0;
    process.exit(code);
}

function waitEvent(event){
    return new Promise((resolve, reject) => {
        event.on('ready', resolve);
        event.on('error', reject);
    });
}

async function prepareAllUnits(){
    let pendingUnits = [];
    allUnits.forEach( unit => {
        pendingUnits.push(waitEvent(unit.eventEmitter));
    });
    console.log('awaiting unit startups before proceeding...');
    await Promise.all(pendingUnits);
}

async function busyWork(){
    // sleep(5000)
    await new Promise(resolve => setTimeout(resolve, 5000));
}

process.on('uncaughtException', (reason) => {
    console.log(reason);
    shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
    console.log(reason);
    shutdown('unhandledRejection');
});

const myUnit1 = require('./unit1.js');
myUnit1.eventEmitter.on( 'ready', () => {
    console.log('Unit 1 is ready.');
});

const myUnit2 = require('./unit2.js');
myUnit2.eventEmitter.on( 'ready', () => {
    console.log('Unit 2 is ready.');
});

const allUnits = [ myUnit1, myUnit2 ];

prepareAllUnits().then(() => {
    console.info('all units ready');
    busyWork().then(() => {
        console.log(`Unit 1: temp:${myUnit1.getTemp()} degree F, pressure:${myUnit1.getPressure()} psi`);
        console.log(`Unit 2: temp:${myUnit2.getTemp()} degree F, pressure:${myUnit2.getPressure()} psi`);
        console.info('fini');
        shutdown('');
    });
});


