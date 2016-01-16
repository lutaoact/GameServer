var BaseModel = require('./BaseModel').BaseModel;

exports.KillBossBonus = BaseModel.subclass({
    classname : 'KillBossBonus',

    initialize: function($super) {
        this.schema = {
            kill_boss_bonus_id : Number,
            turn_limit : Number,
            object_type : Number,
            object_id : Number,
            object_num : Number,
        };
        $super();
    },

});
