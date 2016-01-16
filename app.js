// Include the cluster module
var cluster = require('cluster');

require('./lib/init').init();

// Code to run if we're in the master process
if (cluster.isMaster) {
    writePidFile();
    // Count the machine's CPUs
//    var cpuCount = require('os').cpus().length;
    var cpuCount = config.workerNum;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker,
        // we're not sentimental
        logger.fatal('Worker ' + worker.id + ' died :(');
        if (!config.debug) {
            cluster.fork();
        }
    });
} else {
    require("./worker");
}

function writePidFile() {
    var fs = require('fs');
    var pidfile = './run/app.pid';
    fs.writeFileSync(pidfile, process.pid);

    //kill -15
    process.on('SIGTERM', function() {
        if (fs.existsSync(pidfile)) {
            fs.unlinkSync(pidfile);
        }
        process.exit(0);
    });

    //kill -2
    process.on('SIGINT', function() {
        if (fs.existsSync(pidfile)) {
            fs.unlinkSync(pidfile);
        }
        process.exit(0);
    });
}
