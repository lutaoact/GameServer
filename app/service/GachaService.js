var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');

exports.GachaService = BaseService.subclass({
    classname: 'GachaService',

    show: function(userId, cb) {
        var UserGachaGroup = this.model('UserGachaGroup');
        var UserService = this.service('UserService');

        this.series({
            user: function(next) {
                UserService.getUser(userId, next);
            },
            currentGachas: function(next, res) {
                this.getCurrent(res.user.vip_level, next);
            },
            userGachaGroupMap:function(next) {
                UserGachaGroup.findIndexBy(
                    "group_id", {user_id: userId}, next
                );
            },
            filter: function(next, res) {
                next(null, this.buildGachaList(
                    res.currentGachas, res.userGachaGroupMap
                ));
            },
        }, function(err, res) {
            cb(err, res.filter);
        });
    },

    buildGachaList: function(gachas, userGachaGroupMap) {
        var group = _.groupBy(gachas, function(gacha) {
            return gacha.group_id;
        });

        var result = [];
        _.each(gachas, function(gacha) {
            var userGachaGroup = userGachaGroupMap[gacha.group_id];
            if (userGachaGroup) {
                result.push(userGachaGroup.gacha_id);
            } else {
                //first element in group
                result.push(group[gacha.group_id][0].gacha_id);
            }
        });
        return _.uniq(result);
    },

    getCurrent: function(vipLevel, cb) {
        var Gacha = this.model('Gacha');
        var now = _u.time();
        Gacha.find({
            opened_at:   {'$lte': now},
            closed_at:   {'$gte': now},
            display_vip: {'$lte': vipLevel}
        }, null, {'$sort': {gacha_group_step: 1}}, cb);
    },

});
