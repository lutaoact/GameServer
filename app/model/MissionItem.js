var BaseModel = require('./BaseModel').BaseModel;

exports.MissionItem = BaseModel.subclass({
    classname : 'MissionItem',

    initialize: function($super) {
        this.schema = {
            mission_item_id : Number,
            first_only : Number,
//            first_objectN_type : Number,
//            first_objectN_id : Number,
//            first_objectN_num : Number,
//            objectN_type : Number,
//            objectN_id : Number,
//            objectN_num : Number,
            mission_luck_id : Number,
        };
        var firstLength = 3, objectLength = 5;
        this.addExtensibleKeyForSchema(
            'first_object%d_type', firstLength, Number
        );
        this.addExtensibleKeyForSchema(
            'first_object%d_id', firstLength, Number
        );
        this.addExtensibleKeyForSchema(
            'first_object%d_num', firstLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_type', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_id', objectLength, Number
        );
        this.addExtensibleKeyForSchema(
            'object%d_num', objectLength, Number
        );
        $super();
    },

});
