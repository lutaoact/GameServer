var BaseModel = require('./BaseModel').BaseModel;

exports.StrengthenConstant = BaseModel.subclass({
    classname : 'StrengthenConstant',
    initialize: function($super) {
        this.schema = {
            same_type_exp_factor        : Number,
            great_success_exp_factor    : Number,
            great_success_prob          : Number,
            small_success_exp_factor    : Number,
            small_success_prob          : Number,
        };

        $super();
    },
});
