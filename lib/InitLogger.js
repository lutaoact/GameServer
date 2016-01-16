var config = require('config');
var log4js = require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: config.logger.path, category: '[FT]' },
        {
            type        : 'file' ,
            filename    : '/data/log/dmp.log',
            layout      : {
                type    : 'pattern',
                pattern : "%m%n",
            },
            category    : 'DMP',
        }
    ]
});

var logger = log4js.getLogger('[FT]');
logger.setLevel(config.logger.level);

var logger4DMP = log4js.getLogger('DMP');
logger4DMP.setLevel(config.logger.level);


exports.logger = logger;
exports.logger4DMP = logger4DMP;

