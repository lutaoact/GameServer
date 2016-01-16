var BaseModel = require('./BaseModel').BaseModel;
var UserCard = require('./UserCard').UserCard;

exports.UserCardParty = BaseModel.subclass({
    classname : 'UserCardParty',

    initialize: function($super) {
        var ObjectId = require('mongoose').Schema.Types.ObjectId;
        this.schema = {
            user_id       : ObjectId,
            deck          : Number,//1, 2, 3, 4, 5
//            user_cardN_id : ObjectId,
//            user_card_ids : [{ type:String, ref:'user_card' }],//长度为4的数组
            updated_at    : Number,
        };
        var userCardIdsLength = 4;
        this.addExtensibleKeyForSchema(
            'user_card%d_id', userCardIdsLength,
            { type:String, ref:'user_card' }
        );
        $super();
    },
});
