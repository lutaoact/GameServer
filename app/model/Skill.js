var BaseModel = require('./BaseModel').BaseModel;

exports.Skill = BaseModel.subclass({
    classname : 'Skill',

    initialize: function($super) {
        this.schema = {
            skill_id                : Number,
            skill_name              : String,
            skill_comment           : String,
            skill_icon              : Number,
            skill_type              : Number,
            skill_element           : Number,
//            geneN_id                : Number,
//            geneN_paramM            : Number,
            skill_cooldown          : Number,
            effect_position_x_offset: Number,
            effect_position_y_offset: Number,
            skill_lv1_damage        : Number,
            skill_lvmax_damage      : Number,
            skill_condition         : Number,
        };
        var geneIdLength = 3, paramLength = 8;
        this.addExtensibleKeyForSchema(
            'gene%d_id', geneIdLength, Number
        );
        this.addExtensibleKeyForSchema(
            'gene%d_param%d', {N: geneIdLength, M: paramLength}, Number
        );
        $super();
    },

});
