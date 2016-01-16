var BaseModel = require('./BaseModel').BaseModel;

exports.Scene = BaseModel.subclass({
    classname : 'Scene',

    initialize: function($super) {
        this.schema = {
            scene_id            : Number,
            mission_id          : Number,
            scene_image         : Number,
            monster_party_id    : Number,
            obstacle_party_id   : Number,
        };
        $super();
    },

});
