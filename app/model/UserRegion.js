var BaseModel = require('./BaseModel').BaseModel;

exports.UserRegion = BaseModel.subclass({
    classname : 'UserRegion',

    initialize: function($super) {
        this.schema = {
            user_id : require('mongoose').Schema.Types.ObjectId,
            region_id   :   Number,
            created_at  :   Number,
            updated_at  :   Number,
        };
        $super();
    },
});
