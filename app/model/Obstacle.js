var BaseModel = require('./BaseModel').BaseModel;

exports.Obstacle = BaseModel.subclass({
    classname : 'Obstacle',

    initialize: function($super) {
        this.schema = {
            obstacle_id     : Number,
            obstacle_type   : Number,
            level           : Number,
            max_level       : Number,
            max_hit_times   : Number,
            rand_show       : Number,
        };
        var skillLength = 2;
        this.addExtensibleKeyForSchema(
            'skill%d_id', skillLength, Number
        );
        $super();
    },

});
