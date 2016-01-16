var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');

exports.UserService = BaseService.subclass({
    classname: 'UserService',

    getUsers : function(userIds, cb) {
        var User = this.model('User');
        User.find({_id: {'$in': userIds}}, cb);
    },

    updateEnergy: function(userId, energyCost, cb) {
        var User = this.model('User');
        this.series({
            user: function(next) {
                this.getUser(userId, next);
            },
            update : function(next, res) {
                var newEnergy = this.computeNewEnergy(res.user, energyCost);
                res.user.energy_recover_time = _u.time();
                res.user.energy = newEnergy;
                res.user.save(function(err, update, lines) {
                    next(err, update);
                });
            },
        }, cb);
    },

    computeNewEnergy: function(user, energyCost) {
        return this.computeCurrentEnergy(user) - energyCost;
    },

    computeCurrentEnergy: function(user) {
        var timespan = _u.time() - user.energy_recover_time;
        return _.min([
            timespan * user.energy_recover_speed + user.energy,
            user.max_energy
        ]);
    },

    getUser: function(userId, cb) {
        var User = this.model('User');
        User.findById(userId, cb);
    },

    addMoney : function(userId, money, cb) {
        var User = this.model('User');
        logger.info("addMoney -- user_id:" + userId + " money:" + money);
        User.findByIdAndUpdate(userId, {'$inc': {money: money}}, null, cb);
    },

    getLevelSimialUser : function(user, limitUserNum, cb) {
        var levelRange = 1000;
        var User = this.model('User');
        var levelBottom = user.level - levelRange;
        var levelCeil = user.level + levelRange;

        User.find({
            level   : { $lte: levelCeil, $gte: levelBottom },
            _id     : { $ne: user._id }
        }, null, {
            sort : {'level': -1},
            limit : limitUserNum,
        }, cb);
    },

    createUser : function(cb) {
        var User = this.model('User');
        var data = {
            mobage_id: 1,
            token: "aaa",
            chanel_type: 1,
            level: 1,
            exp: 0,
            energy: 1,
            max_battle_card: 1,
            max_card_bag: 1,
            vip_level: 1,
            energy_recover_speed: 1,
            money: 10000000,
            vip_money: 1,
            point: 1,
            last_area_id : 10001,
        };
        User.save(data, cb);
    },

    createDebugUser : function(cb) {
        var User = this.model('User');
        this.series({
            user : function(next) {
                var data = {
                    mobage_id: 1,
                    nickname: "defaultname",
                    token: "aaa",
                    chanel_type: 1,
                    level: 1,
                    exp: 0,
                    energy: 90,
                    max_battle_card: 1,
                    max_card_bag: 1,
                    vip_level: 1,
                    energy_recover_speed: 1,
                    energy_recover_time : _u.time(),
                    max_energy : 100,
                    money: 10000000,
                    vip_money: 1,
                    point: 1,
                    last_area_id : 10001,
                    current_deck : 1,
                };
                User.save(data, next);
            },
//TODO: remove this logic on prodution env
            saveDefaultCard : function(next, res) {
                var CardService = this.service('CardService');
                var defaultCardIds = [131, 135, 139, 143, 147];
                var defaultCardNum = 5;
                this.eachSeries(defaultCardIds, function(cardId, next) {
                    CardService.addUserCards(
                        res.user._id, cardId, defaultCardNum, next);
                }, next);
            },
        }, function(err, res){
            cb(err, res.user);
        });
    },
});
