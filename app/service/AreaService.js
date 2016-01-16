var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');

exports.AreaService = BaseService.subclass({
    classname: 'AreaService',

    getUserAreas : function(userId, cb) {
        UserArea = this.model('UserArea');
        UserArea.find({'user_id' : userId}, cb);
    },
});
