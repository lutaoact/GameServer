var BaseModel = require('./BaseModel').BaseModel;

exports.User = BaseModel.subclass({
    classname : 'User',

    initialize: function($super) {
        this.schema = {
            nickname: String,
            mobage_id: Number,
            token: String,
            chanel_type: Number,
            level: Number,
            exp: Number,
            energy: Number,
            energy_recover_time: Number,
            energy_recover_speed: Number,
            max_energy: Number,
            max_battle_card: Number,
            max_card_bag: Number,
            vip_level: Number,
            money: Number,
            vip_money: Number,
            point: Number,
            last_area_id: Number,
            current_deck : Number,
            created_at: Number,
            updated_at: Number
        };
        if (config.test) {
            this.schema._id = require('mongoose').Schema.Types.ObjectId;
        }
        $super();
    },
});
