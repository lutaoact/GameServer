var BaseModel = require('./BaseModel').BaseModel;

exports.Area = BaseModel.subclass({
    classname : 'Area',

    initialize: function($super) {
        this.schema = {
            area_id    : Number,
            area_name  : String,
            area_image : String,
            region_id  : Number,
        };
        $super();
    },

});
