var BaseModel = require('./BaseModel').BaseModel;

exports.Evolution = BaseModel.subclass({
    classname : 'Evolution',

    initialize: function($super) {
        this.schema = {
            evolution_id          : Number,
            evo_name        : String,
            money_cost      : Number,
//            objectN_type    : Number,
//            objectN_id      : Number,
//            objectN_num     : Number,
        };
        var objectLength = 10;
        this.addExtensibleKeyForSchema(
            'object%d_type', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_id', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_num', objectLength, Number
        );
        $super();
    },

});
