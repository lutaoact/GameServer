var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./lib/LoadRoutes');
var cluster = require('cluster');
var multipart = require('connect-multiparty');

// doc: https://github.com/expressjs/morgan
var morgan = require('morgan');

// log path
var fs = require('fs');
var accessLog = fs.createWriteStream(config.logging.accessLog, {
    flags: 'a'
});
var errorLog = fs.createWriteStream(config.logging.errorLog, {
    flags: 'a'
});

var app = express();

// write access_log
app.use(morgan({stream: accessLog} ));
app.use(morgan({format: 'dev'} ));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//upload files
app.use(multipart());
app.use(express.static(path.join(__dirname, config.env + 'public')));

//ope view dir
app.set('views', __dirname + "/app/" + config.env + 'view');
app.set('view engine', 'ejs');

router(app);

// err morgan
app.use(function(err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    if (err) {
        errorLog.write(meta + err.stack + '\n');
        logger.error(err);
    }
    next();
});

// Bind to a port
app.listen(config.port);

logger.info('Worker ' + cluster.worker.id + ' running!');
logger4DMP.info('test for DMP');
