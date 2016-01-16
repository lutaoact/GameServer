var BaseModel = require('./BaseModel').BaseModel;

exports.Text = BaseModel.subclass({
    classname : 'Text',

    initialize: function($super) {
        this.schema = {
            key : String,
            value : String,
        };
        $super();
    },
});
