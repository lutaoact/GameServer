var BaseController = require('./BaseController').BaseController;

exports.CardController = BaseController.subclass({
    classname: 'CardController',

    evoUp : function(request, response) {
        console.log(request.param('user_card_id'));
        console.log(request.param('material_user_card_ids'));
        var userCardId = request.param('user_card_id');
        var materialUserCardIds = JSON.parse(
            request.param('material_user_card_ids')
        );

        var CardService = this.service('CardService');
        this.series({
            evoUp : function(next) {
                CardService.evoUp(userCardId, materialUserCardIds, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, res);
        });
    },

    levelUp : function(request, response) {
        var userId = request.param('user_id');
        var userCardId = request.param('user_card_id');
        var materialUserCardIds = JSON.parse(
            request.param('material_user_card_ids')
        );
        var CardService = this.service('CardService');
        this.series({
            levelUp : function(next) {
                CardService.levelUp(
                    userId, userCardId, materialUserCardIds, next
                );
            },
            userCards : function(next) {
                CardService.getUserCards(userId, next);
            },
        }, function(err, res) {
            response.sendErrorOrResult(err, {
                user : res.levelUp.user,
                user_cards : res.userCards,
                success_flag : res.levelUp.successFlag,
            });
        });
    },

});

exports.routes = {
    GET : {
        '/api/card_evo_up' : exports.CardController.createAction('evoUp'),
        '/api/card_level_up' : exports.CardController.createAction('levelUp'),
    },
    POST: {
        '/api/card_evo_up' : exports.CardController.createAction('evoUp'),
        '/api/card_level_up' : exports.CardController.createAction('levelUp'),
    },
};
