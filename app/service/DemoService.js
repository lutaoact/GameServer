var BaseService = require('./BaseService').BaseService;

exports.DemoService = BaseService.subclass({
    classname: 'DemoService',

    initialize: function() {
    },

    isRunning: function(cb) {
        this.series({
            key1: function(next) {
                next(null, 'value1');
            },
            key2: function(next) {
                next(null, 'value2');
            },
        }, cb);
    },
});
