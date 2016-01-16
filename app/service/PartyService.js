var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');

exports.PartyService = BaseService.subclass({
    classname: 'PartyService',

    setUserCardParty : function(userId, deck, update, cb) {
        var UserCardParty = this.model('UserCardParty');
        var User = this.model('User');
        //设置更新时间
        update.updated_at = _u.time();

        this.series({
            upsert : function(next) {
                UserCardParty.findOneAndUpdate({
                    'user_id' : userId,
                    'deck'    : deck,
                }, update, {
                    'upsert' : true
                }, next);
            },
            user : function(next, res) {
                User.findByIdAndUpdate(
                    userId, {current_deck : deck}, null, next
                );
            },
        }, cb);
    },

    getUserCardParties : function(userId, cb) {
        var UserCardParty = this.model('UserCardParty');
        UserCardParty.find({'user_id': userId}, cb);
    },

    getUserCardPartiesByDeck : function(userId, deck, cb) {
        var UserCardParty = this.model('UserCardParty');
        UserCardParty.findOne(
            {'user_id': userId, 'deck': deck},
            null,
            {
                populate :
                    'user_card1_id user_card2_id user_card3_id user_card4_id',
            },
            cb
        );
    },

    getUsersCurrentCardParty : function(users, cb) {
        var result=[];
        this.eachSeries(users, function(user, next) {
            this.getUserCardPartiesByDeck(
                user._id, user.current_deck, function(err, data) {
                    if(data){
                        result.push(data);
                    }
                    next();
                }
            );
        }, function(err) {
            cb(err, result);
        });
    },

    getFriendCardList : function(userId, cb) {
        var limitUserNum = 20;
        var UserService = this.service('UserService');
        this.series({
            user : function(next) {
                UserService.getUser(userId, next);
            },
            levelSimialUsers : function(next, res) {
                UserService.getLevelSimialUser(
                    res.user, limitUserNum, next
                );
            },
            usersCurrentCardParty : function(next, res) {
                var limitUsers = _.first(res.levelSimialUsers, limitUserNum);
                this.getUsersCurrentCardParty(limitUsers, next);
            },
            usersCurrentCardOne : function(next, res) {
                var userCurrentCardOne =
                    _.map(res.usersCurrentCardParty, function(userCardParty) {
                        return {
                            'user_id'       : userCardParty.user_id,
                            'user_card'     : userCardParty.user_card1_id,
                        };
                    }
                );
                next(null, userCurrentCardOne);
            },
        }, function(err, res) {
            cb(err, res.usersCurrentCardOne);
        });
    },
});
