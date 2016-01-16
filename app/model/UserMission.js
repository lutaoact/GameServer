var BaseModel = require('./BaseModel').BaseModel;

exports.UserMission = BaseModel.subclass({
    classname : 'UserMission',

    initialize: function($super) {
        this.schema = {
            user_id : require('mongoose').Schema.Types.ObjectId,
            mission_id      :   Number,
            clear_num       :   Number,
            first_clear_at  :   Number,
            created_at      :   Number,
            updated_at      :   Number,
        };
        $super();
    },

});
