var BaseModel = require('./BaseModel').BaseModel;

exports.CardLevel = BaseModel.subclass({
    classname : 'CardLevel',
    initialize: function($super) {
        this.schema = {
            level           : Number,
        };
        var cardRarityLength = 6;
        this.addExtensibleKeyForSchema(
            'card_rarity%d_exp', cardRarityLength, Number
        );


        $super();
    },
});
