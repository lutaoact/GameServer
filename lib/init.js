exports.init = function() {
    global.config = require('config');
    global.logger = require('./InitLogger').logger;
    global.logger4DMP = require('./InitLogger').logger4DMP;
    global._  = require('underscore');
    global._s = require('underscore.string');
    global._u = require('./util');
    global.Const = require('./Const');
    global.LocalCache = require('./LocalCache').LocalCache;
    global.ErrCode = require('./ErrCode');
};
