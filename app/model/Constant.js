var BaseModel = require('./BaseModel').BaseModel;
var time = require('../../lib/util').time;

exports.Constant = BaseModel.subclass({
    classname : 'Constant',

    initialize: function($super) {
        this.schema = {
            key     : String,
            value   : String,
        };
        $super();
    },

});
