var BaseModel = require('./BaseModel').BaseModel;

exports.ObstacleParty = BaseModel.subclass({
    classname : 'ObstacleParty',

    initialize: function($super) {
        this.schema = {
            obstacle_party_id     : Number,
        };
        var obstacleLength = 10;
        this.addExtensibleKeyForSchema(
            'obstacle%d_id', obstacleLength, Number
        );
        this.addExtensibleKeyForSchema(
            'obstacle%d_x', obstacleLength, Number
        );
        this.addExtensibleKeyForSchema(
            'obstacle%d_y', obstacleLength, Number
        );

        $super();
    },

});
