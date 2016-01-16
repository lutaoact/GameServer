var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');

exports.RegionService = BaseService.subclass({
    classname: 'RegionService',

    getUserRegions: function(userId, cb) {
        var UserRegion = this.model('UserRegion');
        UserRegion.find({'user_id' : userId}, cb);
    },
});
