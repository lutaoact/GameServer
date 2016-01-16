var BaseModel = require('./BaseModel').BaseModel;
var time = require('../../lib/util').time;

exports.UserCard = BaseModel.subclass({
    classname : 'UserCard',

    initialize: function($super) {
        this.schema = {
            user_id         : require('mongoose').Schema.Types.ObjectId,
            card_id         : Number,
            exp             : Number,
            level           : Number,
            hp              : Number,
            attack          : Number,
            speed           : Number,
            luck            : Number,
            cur_hp_egg      : Number,
            cur_speed_egg   : Number,
            cur_attack_egg  : Number,
            created_at      : Number,
            updated_at      : Number
        };
        $super();
    },

});
