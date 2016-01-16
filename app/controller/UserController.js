var BaseController = require('./BaseController').BaseController;

exports.UserController = BaseController.subclass({
    classname: 'UserController',

    setUserCardParty : function(request, response) {
        var userId = request.param('user_id');
        var deck   = request.param('deck');
        var update = this.buildUpdateObject(request);

        var UserService = this.service('UserService');
        var PartyService = this.service('PartyService');
        this.series({
            upsert : function(next) {
                PartyService.setUserCardParty(userId, deck, update, next);
            },
            user : function(next) {
                UserService.getUser(userId, next);
            },
            userCardParties : function(next, res) {
                PartyService.getUserCardParties(userId, next);
            },
        }, function(err, res) {
            logger.info(res);
            response.sendErrorOrResult(err, {
                user: res.user,
                user_card_parties : res.userCardParties,
            });
        });
    },

    buildUpdateObject: function(request) {
        var obj = {}, userCardIdsLength = 4, key = 'user_card%d_id';
        for (var i = 1; i <= userCardIdsLength; i++) {
            var currentKey = _s.sprintf(key, i);
            obj[currentKey] = request.param(currentKey) || '';
        }
        return obj;
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

    getUserInfo : function(request, response) {
        var userId = request.param('user_id');

        var UserService = this.service('UserService');
        var CardService = this.service('CardService');
        var ItemService = this.service('ItemService');
        var MissionService = this.service('MissionService');
        var RegionService = this.service('RegionService');
        var AreaService = this.service('AreaService');
        var PartyService = this.service('PartyService');

        this.series({
            user : function(next) {
                UserService.getUser(userId, next);
            },
            userCards : function(next) {
                CardService.getUserCards(userId, next);
            },
            userItems : function(next) {
                ItemService.getUserItems(userId, next);
            },
            userRegions : function(next) {
                RegionService.getUserRegions(userId, next);
            },
            userAreas : function(next) {
                AreaService.getUserAreas(userId, next);
            },
            areaUserMissions : function(next, res) {
                MissionService.getAreaUserMissions(
                    userId, res.user.last_area_id, next
                );
            },
            userCardParties : function(next, res) {
                PartyService.getUserCardParties(userId, next);
            },
            friendCardList : function(next, res) {
                PartyService.getFriendCardList(userId, next);
            }
        }, function(err, res) {
            response.sendErrorOrResult(
                err, {
                    user                    : res.user,
                    user_cards              : res.userCards,
                    user_items              : res.userItems,
                    user_regions            : res.userRegions,
                    user_areas              : res.userAreas,
                    last_area_id            : res.user.last_area_id,
                    last_area_user_missions : res.areaUserMissions,
                    user_card_parties       : res.userCardParties,
                    friend_card_list        : res.friendCardList,
                }
            );
        });
    },
});

exports.routes = {
    GET : {
        '/api/get_user_info' : exports.UserController.createAction('getUserInfo'),
        '/api/create_user' : exports.UserController.createAction('createUser'),
        '/api/set_user_card_party' : exports.UserController.createAction('setUserCardParty'),
    },
    POST: {
        '/api/get_user_info' : exports.UserController.createAction('getUserInfo'),
        '/api/create_user' : exports.UserController.createAction('createUser'),
        '/api/set_user_card_party' : exports.UserController.createAction('setUserCardParty'),
    },
};
