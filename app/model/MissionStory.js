var BaseModel = require('./BaseModel').BaseModel;

exports.MissionStory = BaseModel.subclass({
    classname : 'MissionStory',

    initialize: function($super) {
        this.schema = {
            mission_story_id : Number,
            condition_who : Number,
            condition_when : Number,
            card_id : Number,
            monster_id : Number,
            hp : Number,
            substitute_monster_id : Number,
            story_message_id : Number,
        };
        $super();
    },

});
