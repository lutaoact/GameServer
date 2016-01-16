module.exports = {
    port: 9001,
    workerNum : 1,
    region: 'CN',
    logging: {
        accessLog : '/data/log/access.log',
        errorLog : '/data/log/error.log',
        debugLog : '/data/log/debug.log',
        logLevel: 'INFO',
    },
    logger : {
        path: '/data/log/debug.log',
        level: 'DEBUG',
    },
    memcached : {
    },
    mongodb: {
        dbURL : 'mongodb://localhost/mydb',
    },
    debug : true,
    env : '',//empty string or 'ope', 'ws', empty string indicates game server
    test : false,
};
