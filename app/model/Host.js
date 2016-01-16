var BaseModel = require('./BaseModel').BaseModel;

exports.Host = BaseModel.subclass({
    classname : 'Host',

    initialize: function($super) {
        this.schema = {
            hostname   : String,
            port       : Number,
            is_valid   : Number,
            created_at : Number,
            updated_at : Number,
        };
        $super();
    },

    findAllValid : function(cb) {
        this.find({'is_valid' : 1}, cb);
    },
});
