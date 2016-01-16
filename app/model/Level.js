var BaseModel = require('./BaseModel').BaseModel;

exports.Level = BaseModel.subclass({
    classname : 'Level',
    initialize: function($super) {
        this.schema = {
            level           : Number,
            exp             : Number,
            energy_limit    : Number,
            friend_limit    : Number,
            user_card_limit : Number,
        };

        $super();
    },
});
