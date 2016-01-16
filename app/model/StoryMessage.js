var BaseModel = require('./BaseModel').BaseModel;

exports.StoryMessage = BaseModel.subclass({
    classname : 'StoryMessage',

    initialize: function($super) {
        this.schema = {
            story_message_id : Number,
        };

        var messageLength = 10;
        this.addExtensibleKeyForSchema(
            'message%d', messageLength, String
        );
        this.addExtensibleKeyForSchema(
            'bg_image%d', messageLength, String
        );

        $super();
    },

});
