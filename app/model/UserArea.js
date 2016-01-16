var BaseModel = require('./BaseModel').BaseModel;

exports.UserArea = BaseModel.subclass({
    classname : 'UserArea',

    initialize: function($super) {
        this.schema = {
            user_id : require('mongoose').Schema.Types.ObjectId,
            area_id	    :	Number,
            created_at	:	Number,
            updated_at	:	Number,
        };
        $super();
    },

});
