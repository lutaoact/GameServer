var BaseModel = require('./BaseModel').BaseModel;

exports.Card = BaseModel.subclass({
    classname : 'Card',
    initialize: function($super) {
        this.schema = {
            card_id          : Number,
            card_name        : String,
            card_comment     : String,
            card_sex         : Number,
            card_race        : Number,
            card_type        : Number,
            card_cost        : Number,
            shoot_type       : Number,
            rarity           : Number,
            max_rarity       : Number,
            evo_id           : Number,
            evo_card_id      : Number,
            level_default    : Number,
            level_max        : Number,
            growth_type      : Number,
            hp_default       : Number,
            hp_max           : Number,
            hp_egg_limit     : Number,
            attack_default   : Number,
            attack_max       : Number,
            attack_egg_limit : Number,
            speed_default    : Number,
            speed_max        : Number,
            speed_egg_limit  : Number,
            skill_id         : Number,
            passive_skill_id : Number,
            special_skill_id : Number,
            mixed_skill_id   : Number,
            //friendshipN_id   : Number,
            luck_default    : Number,
            luck_max        : Number,
            material_exp    : Number,
            hp_egg          : Number,
            attack_egg      : Number,
            speed_egg       : Number,
        };

        //对于可扩展性的键进行批量添加
        var friendshipIdLength = 1;
        this.addExtensibleKeyForSchema(
            'friendship%d_id', friendshipIdLength, Number
        );

        $super();
    },
});
