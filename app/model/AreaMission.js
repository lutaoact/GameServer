var BaseModel = require('./BaseModel').BaseModel;

exports.AreaMission = BaseModel.subclass({
    classname : 'AreaMission',

    initialize: function($super) {
        this.schema = {
            mission_id : Number,
            next_area_id : Number,
        };
        $super();
    },
});
