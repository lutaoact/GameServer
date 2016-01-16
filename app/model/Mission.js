var BaseModel = require('./BaseModel').BaseModel;

exports.Mission = BaseModel.subclass({
    classname : 'Mission',

    initialize: function($super) {
        this.schema = {
            mission_id : Number,
            zone_id : Number,
            mission_name : String,
            mission_comment : String,
            get_exp : Number,
            min_get_moneny : Number,
            max_get_moneny : Number,
            mission_item_id : Number,
            energy_cost : Number,
//            pre_missionN_id : Number,
            challenge_max_num : Number,
            challenge_daily_reset : Number,
            friendship_only : Number,
            open_minute : String,
            open_hour   : String,
            open_day    : String,
            open_month  : String,
            open_year : String,
            open_week : String,
            required_level : Number,
            required_power : Number,
            required_shoot_type : Number,
            required_card_level : Number,
            required_card_sex : Number,
            required_card_type : Number,
            required_card_race : Number,
            required_card_evo_rarity : Number,
            required_card_id : Number,
            kill_boss_bonus_id : Number,
            mission_story_id : Number,
        };
        var preMissionIdLength = 5;
        this.addExtensibleKeyForSchema(
            'pre_mission%d_id', preMissionIdLength, Number
        );
        $super();
    },

});
