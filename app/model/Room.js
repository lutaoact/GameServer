var BaseModel = require('./BaseModel').BaseModel;
var RoomStatus = require('../../lib/Const').RoomStatus;
var RoomMaxNum = require('../../lib/Const').RoomMaxNum;

exports.Room = BaseModel.subclass({
    classname : 'Room',

    initialize: function($super) {
        var ObjectId = require('mongoose').Schema.Types.ObjectId;
        this.schema = {
            host_id     : ObjectId,
            gps         : {
                type: [Number],//两个数字成对
                index : '2d',
            },
            owner_id    : ObjectId,
            max_num     : Number,
            status      : Number,//0:队友募集中 1:正在战斗 2:房间关闭
            members     : [ String ],//成员的user_id
            random_seed : Number,
            created_at  : Number,
            updated_at  : Number,
        };
        $super();
    },

    findNearValid : function(gps, cb) {
        this.find({
            gps : {'$near' : gps},
            'status' : RoomStatus.Waiting,
            '$where' : function() {
                return this.members.length < this.max_num;
            },
        }, null, {
            lean : true,
            limit :5,
        }, function(err, results) {
            cb(err, _u.arrayOmit(
                results, ['__v', 'created_at', 'updated_at']
            ));
        });
    },
});
