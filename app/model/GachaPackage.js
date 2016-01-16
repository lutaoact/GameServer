var BaseModel = require('./BaseModel').BaseModel;

exports.GachaPackage = BaseModel.subclass({
    classname : 'GachaPackage',

    initialize: function($super) {
        this.schema = {
            gacha_package_id    : Number,
            card_id             : Number,
            probability         : Number,
        };
        $super();
    },

});
