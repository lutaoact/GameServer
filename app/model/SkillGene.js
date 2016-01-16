var BaseModel = require('./BaseModel').BaseModel;

exports.SkillGene = BaseModel.subclass({
    classname : 'SkillGene',

    initialize: function($super) {
        this.schema = {
            skill_gene_id : Number,
            gene_comment : String,
            caster_effect : Number,
            target_effect : Number,
            buff_icon : Number,
        };
        $super();
    },

});
