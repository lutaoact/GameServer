var BaseModel = require('./BaseModel').BaseModel;
var time = require('../../lib/util').time;

exports.UserItem = BaseModel.subclass({
    classname : 'UserItem',

    initialize: function($super) {
        this.schema = {
            user_id : require('mongoose').Schema.Types.ObjectId,
            item_id	    : Number,
            item_num	: Number,
            created_at	: Number,
            updated_at	: Number,
        };
        $super();
    },

});
