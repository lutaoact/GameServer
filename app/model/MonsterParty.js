var BaseModel = require('./BaseModel').BaseModel;

exports.MonsterParty = BaseModel.subclass({
    classname : 'MonsterParty',

    initialize: function($super) {
        this.schema = {
            monster_party_id : Number,
            //formationN_id : Number,
            has_boss_party : Number,
            //monsterN_id : Number,
            special_event_trigger : Number,
            special_skill_id : Number,
        };
        var formationIdLength = 4, monsterIdLength = 10;
        this.addExtensibleKeyForSchema(
            'formation%d_id', formationIdLength, Number
        );
        this.addExtensibleKeyForSchema(
            'monster%d_id', formationIdLength, Number
        );
        $super();
    },

});
