var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');
var time = require('../../lib/util').time;

exports.DebugService = BaseService.subclass({
    classname: 'DebugService',

    levelUp : function(userCardId, cardLevel, cb) {
        var CardService = this.service('CardService');
        var UserCard = this.model('UserCard');
        var CardLevel   = this.model('CardLevel');
        var Card   = this.model('Card');

        this.series({
            userCard : function(next) {
                UserCard.findById(userCardId, next);
            },
            setLevel : function(next, res) {
                res.userCard.level = cardLevel;
                next (null, {});
            },
            levelExp : function(next, res) {
                CardLevel.findOne({level: cardLevel}, next);
            },
            cardMap : function(next, res) {
                Card.findIndexBy('card_id', {}, next);
            },
            updateUserCardAccordingLevel : function(next, res) {
                myCard = res.cardMap[res.userCard.card_id];
                myRarity = myCard.rarity;
                res.userCard.exp =
                    res.levelExp['card_rarity' + myRarity + '_exp'];
                CardService.updateUserCardAccordingLevel(
                    res.userCard, myCard
                );
                next();
            },
            saveUserCard : function(next, res) {
                res.userCard.save(next);
            },

        }, function(err, res){
           cb(err, res);
        });
    },

    setUserInfo : function(userId, user, cb) {
        this.series({
            setUserInfo : function(next) {
               var User = this.model('User');
               User.update({_id : userId}, {'$set' : user}, next);
            },
            user : function(next, res) {
                var UserService = this.service('UserService');
                UserService.getUser(userId, next);
            },
        }, function(err, res){
            cb(err, res.user);
        });
    },
});
