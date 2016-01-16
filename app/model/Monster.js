var BaseModel = require('./BaseModel').BaseModel;

exports.Monster = BaseModel.subclass({
    classname : 'Monster',

    initialize: function($super) {
        this.schema = {
            monster_id          : Number,
            monster_type        : Number,
            card_id             : Number,
            level               : Number,
            atk                 : Number,
            hp                  : Number,
            hp_layer_num        : Number,
//            monster_skillN_id   : Number,
//            passive_skillN_id   : Number,
            rage_rate           : Number,
            weak_change_type    : Number,
            weak_change_num     : Number,
//            objectN_type        : Number,
//            objectN_id          : Number,
//            objectN_num         : Number,
//            objectN_rate        : Number,
        };
        var monsterSkillIdLength = 4, passiveSkillIdLength = 4;
        this.addExtensibleKeyForSchema(
            'monster_skill%d_id', monsterSkillIdLength, Number
        );
        this.addExtensibleKeyForSchema(
            'passive_skill%d_id', monsterSkillIdLength, Number
        );

        var objectLength = 3;

        this.addExtensibleKeyForSchema(
            'object%d_type', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_id', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_num', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_rate', objectLength, Number
        );

        $super();
    },

});
