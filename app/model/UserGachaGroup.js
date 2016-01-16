var BaseModel = require('./BaseModel').BaseModel;
var time = require('../../lib/util').time;

exports.UserGachaGroup = BaseModel.subclass({
    classname : 'UserGachaGroup',

    initialize: function($super) {
        this.schema = {
            user_id         : require('mongoose').Schema.Types.ObjectId,
            group_id        : Number,
            gacha_id        : Number,
            times           : Number,
            created_at      : Number,
            updated_at      : Number,
        };
        $super();
    },

});
