var BaseModel = require('./BaseModel').BaseModel;

exports.GachaProbability = BaseModel.subclass({
    classname : 'GachaProbability',

    initialize: function($super) {
        this.schema = {
            gacha_probability_id    : Number,
            package_id              : Number,
            num                     : Number,
        };
        $super();
    },

});
