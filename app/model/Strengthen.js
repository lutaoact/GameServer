var BaseModel = require('./BaseModel').BaseModel;

exports.Strengthen = BaseModel.subclass({
    classname : 'Strengthen',
    initialize: function($super) {
        this.schema = {
            rarity                  : Number,
            material_exp_lv1        : Number,
            first_cost_lv1          : Number,
            first_cost_lv_factor    : Number,
            next_cost               : Number,
        };

        $super();
    },
});
