module.exports = {
    FirstOnlyRewardsLength : 3,
    NormalRewardsLength : 5,
    LuckRewardsLength : 10,
    RoomMaxNum : 4,

    RoomStatus : {
        Waiting : 0,
        Playing : 1,
        Closed : 2,
    },

    MaxLuck : 100,

    ObjectType : {
        Item : 1,
        Card : 2,
    },

    CardProps : ['hp', 'speed', 'attack'],

    Strengthen : {
        SameTypeExpFactor : 1.5,
        GreatSuccessExpFactor : 2,
        SmallSuccessExpFactor : 1.5,
        GreatSuccessProb : 30,
        SmallSuccessProb : 70,
    },
    userId : '111111111111111111111111',
};
