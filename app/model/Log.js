var BaseModel = require('./BaseModel').BaseModel;

exports.Log = BaseModel.subclass({
    classname : 'Log',

    initialize: function($super) {
        this.dbURL = 'mongodb://localhost/ft_log';//TODO
        this.schema = {
            log_type   : Number,
            user_id : require('mongoose').Schema.Types.ObjectId,
            created_at : Number,
            detail     : {},//Schema.Types.Mixed
        };
        $super();
    },
});
