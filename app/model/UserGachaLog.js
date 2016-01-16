var BaseModel = require('./BaseModel').BaseModel;
var time = require('../../lib/util').time;

exports.UserGachaLog = BaseModel.subclass({
    classname : 'UserGachaLog',

    initialize: function($super) {
        this.schema = {
            user_id         : require('mongoose').Schema.Types.ObjectId,
            gacha_id        : Number,
            payment_type    : Number,
            price           : Number,
            num             : Number,
            cards           : [ String ],
            created_at      : Number,
        };
        $super();
    },

});
