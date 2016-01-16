var BaseModel = require('./BaseModel').BaseModel;
var underscore = require('underscore');


exports.Demo = BaseModel.subclass({
    classname : 'Demo',

    initialize: function($super) {
        this.schema = {
            name: {
                type: String,
                match: /\w+/
            },
            description: String
        };
        $super();
    },

});
