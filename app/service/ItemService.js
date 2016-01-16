var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');
var time = require('../../lib/util').time;

exports.ItemService = BaseService.subclass({
    classname: 'ItemService',

    getUserItems : function(userId, cb) {
        var UserItem = this.model('UserItem');
        UserItem.find({'user_id' : userId}, cb);
    },

    minusUserItem : function(userId, itemId, num, cb) {
        var UserItem = this.model('UserItem');
        var now = time();
        if (num <  0){
            num = -num;
        }
        UserItem.update({
            'user_id' : userId,
            'item_id' : itemId
        }, {
            '$inc': {'item_num': -num},
        }, cb);
    },

    addUserItem : function(userId, itemId, num, cb) {
        var UserItem = this.model('UserItem');
        var now = time();
        this.series({
            userItem : function(next) {
                UserItem.findOne({
                    'user_id' : userId,
                    'item_id' : itemId
                }, next);
            },
            upsert : function(next, res) {
                if (res.userItem) {
                    res.userItem.update({
                        '$inc': {'item_num': num},
                        'updated_at' : now,
                    }, next);
                } else {
                    var data = {
                        'user_id'   : userId,
                        'item_id'   : itemId,
                        'item_num'  : num,
                    };
                    UserItem.save(data, next);
                }
            },
        }, cb);
//        UserItem.findOneAndUpdate({
//            'user_id' : userId,
//            'item_id' : itemId
//        }, {
//            $inc       : {'item_num' : num},
//            updated_at : now
//        }, function(err, result) {
//            if (!result) {
//                UserItem.save({
//                    'user_id'   : userId,
//                    'item_id'   : itemId,
//                    'item_num'  : num,
//                    'created_at': now,
//                    'updated_at': now,
//                }, cb);
//            }
//        });
    }
});
