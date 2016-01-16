var BaseModel = require('./BaseModel').BaseModel;

exports.MonsterFormation = BaseModel.subclass({
    classname : 'MonsterFormation',

    initialize: function($super) {
        this.schema = {
            monster_formation_id : Number,
            formation_name       : String,
            comment              : String,
            max_num              : Number,
//            xN : Number,
//            yN : Number,
        };
        var coordinateLength = 10;
        this.addExtensibleKeyForSchema(
            'x%d', coordinateLength, Number
        );
        this.addExtensibleKeyForSchema(
            'y%d', coordinateLength, Number
        );
        $super();
    },

});
