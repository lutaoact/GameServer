var BaseModel = require('./BaseModel').BaseModel;

exports.Region = BaseModel.subclass({
    classname : 'Region',

    initialize: function($super) {
        this.schema = {
            region_id    : Number,
            region_name  : String,
            region_image : Number,
        };
        $super();
    },

});
