var async = require('async');
var Class = require('./Class').Class;
require('./init').init();

exports.AsyncClass = Class.subclass({
    classname: 'AsyncClass',

    rId : 0,//requestId

    $waterfall: function(tasks, callback) {
        this._bindSelf(tasks);
        callback = this._createCb(callback);
        async.waterfall(tasks, callback);
    },

    $_createCb: function(callback) {
        if (!callback)
            return null;
        var self = this;
        return function() {
            callback.apply(self, arguments);
        };
    },

    $_bindSelf: function(tasks) {
        for (var i in tasks) {
            var task = tasks[i];
            if (task instanceof Array) {
                var func = task[task.length-1];
                task[task.length-1] = this._createFunc(func)
            } else {
                tasks[i] = this._createFunc(task);
            }
        }
    },
    $_createFunc: function(task, args) {
        var self = this;
        return function() {
            try {
                task.apply(self, arguments);
            } catch(e) {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] instanceof Function) {
                        arguments[i].call(self, e);
                        return;
                    }
                }
                throw e;
            }
        };
    },

    $auto: function(tasks, callback) {
        this._bindSelf(tasks);
        callback = this._createCb(callback);
        async.auto(tasks, callback);
    },

    $series: function(tasks, callback) {
        var prev;
        var self = this;
        // use async.auto
        for (var i in tasks) {
            var task = tasks[i];
            if (prev) {
                tasks[i] = [prev, this._createFunc(task, arguments)];
            } else {
                tasks[i] = this._createFunc(task, arguments);
            }
            prev = i;
        }
        callback = this._createCb(callback);
        async.auto(tasks, callback);
    },
    $forEachSeries: function(list, tasks, callback) {
        tasks = this._createFunc(tasks);
        callback = this._createCb(callback);
        async.forEachSeries(list, tasks, callback);
    },
    $eachSeries: function(list, tasks, callback) {
        tasks = this._createFunc(tasks);
        callback = this._createCb(callback);
        async.eachSeries(list, tasks, callback);
    },
    $parallel: function(tasks, callback) {
        this._bindSelf(tasks);
        callback = this._createCb(callback);
        async.parallel(tasks, callback);
    },
    $map: function(list, tasks, callback) {
        tasks = this._createFunc(tasks);
        callback = this._createCb(callback);
        async.map(list, tasks, callback);
    },
    $mapSeries: function(list, tasks, callback) {
        tasks = this._createFunc(tasks);
        callback = this._createCb(callback);
        async.mapSeries(list, tasks, callback);
    },
    $times: function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    },
    $timesSeries: function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    },
    $getCallback: function() {
        var key, cb;
        if (arguments.length == 1) {
            cb = arguments[0];
        } else {
            key = arguments[0];
            cb = arguments[1];
        }
        return function(err, res) {
            if (err) {
                cb(err);
            } else {
                if (!key) {
                    var arr = Object.keys(res);
                    key = arr[arr.length-1];
                }
                cb(null, res[key]);
            }
        }
    },

    service : function(name) {
        var service = new (require('../app/service/' + name)[name]);
        service.rId = this.rId;
        return service;
    },

    model: function(name) {
        var model = new (require('../app/model/' + name)[name]);
        model.rId = this.rId;
        return model;
    },

    /*
     * 日志级别由低到高：TRACE DEBUG INFO WARN ERROR FATAL
     */
    logD : function(msg) {
        logger.debug(_s.sprintf("[RID:%s] %s", this.rId, msg));
    },

    logI : function(msg) {
        logger.info(_s.sprintf("[RID:%s] %s", this.rId, msg));
    },

    logW : function(msg) {
        logger.warn(_s.sprintf("[RID:%s] %s", this.rId, msg));
    },

    logE : function(msg) {
        logger.error(_s.sprintf("[RID:%s] %s", this.rId, msg));
    },

    logF : function(msg) {
        logger.fatal(_s.sprintf("[RID:%s] %s", this.rId, msg));
    },
});
