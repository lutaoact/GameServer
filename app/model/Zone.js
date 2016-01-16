var BaseModel = require('./BaseModel').BaseModel;

exports.Zone = BaseModel.subclass({
    classname : 'Zone',

    initialize: function($super) {
        this.schema = {
            zone_id         : Number,
            zone_name       : String,
            area_id         : Number,
            zone_icon       : String,
            zone_type       : Number,
            //pre_missionN_id : Number,
        };
        var preMissionIdLength = 1;
        this.addExtensibleKeyForSchema(
            'pre_mission%d_id', preMissionIdLength, Number
        );
        $super();
    },

});
