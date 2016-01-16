var BaseModel = require('./BaseModel').BaseModel;

exports.MissionLuck = BaseModel.subclass({
    classname : 'MissionLuck',

    initialize: function($super) {
        this.schema = {
            mission_luck_id : Number,
            //objectN_type : Number,
            //objectN_id : Number,
            //objectN_num : Number,
            //luckN_rate : Number,
        };
        var objectLength = 10;
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
            'luck%d_rate', objectLength, Number
        );
        $super();
    },

});
