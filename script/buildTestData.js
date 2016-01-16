require('../lib/init').init();
var async = require('async');
var FileUtils = require('fileutils');

var testDataMap = {
    User        : [{
        user_id: 1,
        mobage_id: 1,
        token: "aaa",
        chanel_type: 1,
        level: 1,
        exp: 1,
        energy: 1,
        max_battle_card: 1,
        max_card_bag: 1,
        vip_level: 1,
        energy_recover_speed: 1,
        money: 1,
        vip_money: 1,
        point: 1,
        last_area_id : 10001,
    }],
    UserArea    : [{
        user_id : 1,
        area_id : 10001,
    }],
    UserCard    : [{
        user_id         : 1,
        card_id         : 1,
        level           : 1,
        hp              : 1,
        attack          : 1,
        speed           : 1,
        luck            : 1,
    }],
    UserItem    : [{
        user_id     : 1,
        item_id     : 1,
        item_num    : 110,
    }],
    UserMission : [{
        user_id         :   1,
        mission_id      :   100,
        clear_num       :   1,
        first_clear_at  :   1,
    }],
    UserRegion  : [{
        user_id     :   1,
        region_id   :   1,
    }],
};

async.waterfall([
    function(next) {
        _u.makeDynamicModelMap(next);
    },
    function(map, next) {
        _u.saveData(map, testDataMap, next);
    },
], function(err) {
    process.exit(0);
});
