var BaseModel = require('./BaseModel').BaseModel;

exports.Gacha = BaseModel.subclass({
    classname : 'Gacha',

    initialize: function($super) {
        this.schema = {
            gacha_id            : Number,
            name                : String,
            comment             : String,
            group_id            : Number,
            group_step          : Number,
            draw_limit          : Number,
            payment_type        : Number,
            position            : Number,
            display_order       : Number,
            opened_at           : Number,
            closed_at           : Number,
            is_count_down       : Number,
            display_vip         : Number,
        };
        var gachaLength = 2, bannerLength = 4;
        this.addExtensibleKeyForSchema(
            'num%d', gachaLength, Number
        );
        this.addExtensibleKeyForSchema(
            'price%d', gachaLength, Number
        );
        this.addExtensibleKeyForSchema(
            'gacha_probability_id%d', gachaLength, Number
        );
        this.addExtensibleKeyForSchema(
            'banner_id%d', bannerLength, Number
        );
        $super();
    },

});
