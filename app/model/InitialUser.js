var BaseModel = require('./BaseModel').BaseModel;
var underscore = require('underscore');


exports.InitialUser = BaseModel.subclass({
    classname : 'InitialUser',

    initialize: function($super) {
        this.schema = {
            initial_user_id : String,
            chanel_type: Number,
            default_level: Number,
            default_exp: Number,
            default_energy: Number,
            max_battle_card: Number,
            max_card_bag: Number,
            vip_level: Number,
            energy_recover_speed: Number,
            money: Number,
            vip_money: Number,
            point: Number,
        }
        //对于可扩展性的键进行批量添加
        var defaultCardLength = 5;
        this.addExtensibleKeyForSchema(
            'default_card%d_id', defaultCardLength, Number
        );
        this.addExtensibleKeyForSchema(
            'default_item%d_id', defaultCardLength, Number
        );

        $super();
    },

});
