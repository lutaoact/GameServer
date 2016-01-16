var BaseController = require('../controller/BaseController').BaseController;

global.OpeConst = require('../../lib/OpeConst');
global.MasterDataConf = require('../../config/MasterDataConf');

exports.DebugController = BaseController.subclass({
    classname: 'DebugController',

    index : function(request, response) {
        response.render('index', {good : 5, userIds : [10, 11, 12]});
    },

    userManager : function(request, response) {
        var userId = request.param('user_id');
        response.render('user_manager', {user_id: userId});
    },

    getDynamicData : function(request, response) {
        var name = request.param('name');
        var userId = request.param('user_id');

        if(name){
            var Model = this.model(_u.convertToCamelCase(name));
            Model.find(
                { '$or' : [{user_id: userId}, {_id: userId}] },
                function(err, res) {
                    if(err) console.log(err);
                    response.render(
                        'dynamic_data',
                        { results: res, name: name, user_id: userId }
                    );
                }
            );
        }else{
            response.render(
                'dynamic_data',
                {results:{}, name: "", user_id: userId}
            );
        }
    },


    getStaticData : function(request, response) {
        var name = request.param('name');
        if(name){
            var Model = this.model(_u.convertToCamelCase(name));
            Model.find({}, function(err, res) {
                if(err) console.log(err);
                response.render('static_data', {results: res, name: name});
            })
        }else{
            response.render('static_data', {results:{}, name: ""});
        }
    },

    showUser : function(request, response) {
        var userId = request.param('user_id');
        var UserService = this.service('UserService');
        UserService.getUser(userId, function(err, user) {
            response.render('user', {user: user});
        });
    },

    addMoney : function(request, response) {
        var userId = request.param('user_id');
        var money = request.param('money');
        var UserService = this.service('UserService');

        this.series({
            addMoney : function(next) {
                UserService.addMoney(userId, money, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, res.addMoney);
        });
    },

    createUser : function(request, response) {
        var UserService = this.service('UserService');
        this.series({
            user : function(next) {
                UserService.createDebugUser(next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, {user_id : res.user._id});
        });
    },

    cardLevelUp : function(request, response) {
        var userCardId = request.param('user_card_id');
        var level = request.param('level');
        var DebugService = this.service('DebugService');
        this.series({
            levelUp : function(next) {
                DebugService.levelUp(userCardId, level, next);
            }
        }, function(err, res){
            response.sendErrorOrResult(err, {});
        });
    },

    getAllUserCards : function(request, response) {
        var userId = request.param('user_id');
        var CardService = this.service('CardService');
        this.series({
            userCards : function(next) {
                CardService.getUserCards(userId, next);
            }
        }, function(err, res) {
            if(err) console.log(err);
            response.render(
                'card_list', {
                    user_cards: res.userCards,
                    user_id: userId
                }
            );
        });
    },

//    cardLevelUp : function(request, response) {
//        var userCardId = request.param('user_card_id');
//        response.send(userCardId);
//    },

    addUserCard : function(request, response) {
        var userId = request.param('user_id');
        var cardId = request.param('card_id');
        var CardService = this.service('CardService');

        this.series({
            addCard : function(next) {
                CardService.addUserCard(userId, cardId, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, {});
        });
    },

    setUserInfo : function(request, response) {
        var user = _.pick(request.param, _.keys(OpeConst.UserKeyMap));
        var DebugService = this.service('DebugService');

        _.each(_.keys(OpeConst.UserKeyMap), function(key) {
            var value = request.param(key);
            if(value && value != 'undefined'){
                user[key] = value;
            }
        });

        DebugService.setUserInfo(user._id, user, function(err, res) {
            response.render('user', {user: user});
        });
    },
});

exports.routes = {
    GET : {
        '/' : exports.DebugController.createAction('index'),
        '/get_all_user_cards' : exports.DebugController.createAction('getAllUserCards'),
        '/card_level_up' : exports.DebugController.createAction('cardLevelUp'),
        '/show_user' : exports.DebugController.createAction('showUser'),
        '/set_user_info' : exports.DebugController.createAction('setUserInfo'),
        '/get_static_data' : exports.DebugController.createAction('getStaticData'),
        '/get_dynamic_data' : exports.DebugController.createAction('getDynamicData'),
        '/user_manager' : exports.DebugController.createAction('userManager'),
    },

    POST: {
        '/card_level_up' : exports.DebugController.createAction('cardLevelUp'),
        '/add_user_card' : exports.DebugController.createAction('addUserCard'),
        '/create_user' : exports.DebugController.createAction('createUser'),
        '/add_money' : exports.DebugController.createAction('addMoney'),
        '/set_user_info' : exports.DebugController.createAction('setUserInfo'),
        '/get_static_data' : exports.DebugController.createAction('getStaticData'),
        '/get_dynamic_data' : exports.DebugController.createAction('getDynamicData'),
        '/user_manager' : exports.DebugController.createAction('userManager'),
    },
};
