var BaseService = require('./BaseService').BaseService;
var MasterDataConf = require('../../config/MasterDataConf');
var _ = require('underscore');
var convertToCamelCase = require('../../lib/util').convertToCamelCase;

exports.DataService = BaseService.subclass({
    classname: 'DataService',

    initialize: function() {
    },

    getMasterData : function(cb) {
        var result = {};
        this.eachSeries(_.keys(MasterDataConf), function(table, next) {
            var modelName = convertToCamelCase(table);
            this.model(modelName).findAll(
                null, {lean : true, sort : {'_id': 1}},
                function(err, data) {
                    result[table] = _u.arrayOmit(data, ['_id', '__v']);
                    next(err);
                }
            );
        }, function(err) {
            cb(err, result);
        });
    },

    getSystemText : function(cb) {
        var region = config.region.toLowerCase();
        cb(null, require('../../config/' + region + '/text'));
    },
});
