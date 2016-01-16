var BaseModel = require('./BaseModel').BaseModel;

exports.Friendship = BaseModel.subclass({
    classname : 'Friendship',

    initialize: function($super) {
        this.schema = {
            friendship_id       : Number,
//            target_cardN_id     : Number,
            friendship_skill_id : Number,
        };
        var targetCardIdLength = 5;
        this.addExtensibleKeyForSchema(
            'target_card%d_id', targetCardIdLength, Number
        );
        $super();
    },

});
