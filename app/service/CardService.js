var BaseService = require('./BaseService').BaseService;
var Random = require('../../lib/mt').MersenneTwister;
var _ = require('underscore');

exports.CardService = BaseService.subclass({
    classname: 'CardService',

    successFlag: 0,//0:一般 1:小成功 2:大成功，会在getSuccessExpFactor中赋值

    canEvoUp : function(
        userCard, myCard, evolution, user, userItems,
        materialUserCards, evoMaterials
    ) {
        var isLevelEnough       = this.isMaxLevel(userCard, myCard);
        var isEvoValid          = this.isEvoValid(myCard);
        var hasEnoughMoney      = this.hasEnoughMoney(user, evolution);
        var isMaterialsEnough   = this.isMaterialsEnough(
            userItems, evoMaterials, materialUserCards
        );

        return isLevelEnough && isEvoValid &&
               hasEnoughMoney && isMaterialsEnough;
    },

    isEvoValid : function(card) {
        return card.evo_id > 0;
    },

    isMaxLevel: function(userCard, myCard) {
        return userCard.level == myCard.level_max;
    },

    hasEnoughMoney : function(user, evolution) {
        return user.money >= evolution.money_cost;
    },

    isMaterialsEnough : function(userItems,
        evoMaterials, materialUserCards) {

        return _.every(evoMaterials, function(material, next) {
            switch (material.object_type) {
                case Const.ObjectType.Item:
                    var userItem = userItems[material.object_id];
                    var itemEnough =
                        userItem.item_num >= material.object_num;
                    return itemEnough;
                case Const.ObjectType.Card:
                    materialCards = materialUserCards[material.object_id];
                    var isCardEnough =
                         _.size(materialCards) >= material.object_num;
                    return isCardEnough;
                default:
                    return false;
            }
        });
    },

    minusUserMaterialItems : function (evoMaterials, userId, cb) {
        var ItemService = this.service('ItemService');
         this.eachSeries(evoMaterials, function(evoMaterial, next) {
            if (evoMaterial.object_type === Const.ObjectType.Item){
                ItemService.minusUserItem(
                    userId,
                    evoMaterial.object_id,
                    evoMaterial.object_num,
                    next
                );
            }else{
                next();
            }
        }, cb);

    },

    getUserCardDefault : function(cardId, userId, cb) {
        var Card = this.model('Card');
        this.series({
            cardDefault : function(next) {
                Card.findOne({'card_id' : cardId}, next);
            },
            userCardDefault : function(next, res) {
                var userCardDefault = {
                    user_id         : userId,
                    card_id         : res.cardDefault.card_id,
                    level           : res.cardDefault.level_default ,
                    hp              : res.cardDefault.hp_default    ,
                    attack          : res.cardDefault.attack_default,
                    speed           : res.cardDefault.speed_default ,
                    luck            : res.cardDefault.luck_default  ,
                    exp             : 0,
                    cur_hp_egg      : 0,
                    cur_speed_egg   : 0,
                    cur_attack_egg  : 0,
                };
                next(null, userCardDefault);
            }
        }, function(err, res){
            cb(err, res.userCardDefault);
        });
    },

    /* 获得进化后的卡牌。
     * 根据配置信息中获得进化后的卡牌初始化信息，
     * 加上进化基础卡牌的加蛋数值。
     * @param [Object]  基础进化卡牌信息
     * @param [Object]  基础卡牌静态配置
     */
    getCardAfterEvo : function(userCard, card, cb) {
        var Card = this.model('Card');
        this.series({
            defaultUserCard : function(next) {
                this.getUserCardDefault(
                    card.evo_card_id,
                    userCard.user_id,
                    next
                );
            },
            cardInheritEggs : function(next, res) {
                var userCardEggs = {
                    cur_hp_egg      : 0,
                    cur_speed_egg   : 0,
                    cur_attack_egg  : 0,
                };
               // _.pick(
               //     userCard, 'cur_hp_egg', 'cur_speed_egg', 'cur_attack_egg'
               // );
                next(null, _.extend(res.defaultUserCard, userCardEggs));
            },
        }, function(err, res){
            cb(err, res.cardInheritEggs);
        });
    },

    /* 实际进化操作的函数
     * @param [Array]   配置表中配置的材料
     * @param [Array]   用户选择的材料卡牌的user_card_id
     * @param [Integer] 需要消耗的金币
     * @param [Object]  进化基础卡牌
     * @param [Object]  进化基础卡牌的配置信息
     */
    doEvoUp : function(
        evoMaterials, materialUserCardIds, moneyCost, userCard, card, cb
    ) {
        var UserCard = this.model('UserCard');
        var User = this.model('User');
        var userId = userCard.user_id;

        this.series({
            deleteUserMaterialCards : function(next) {
                UserCard.remove(
                    {'_id': {$in: materialUserCardIds}}, next
                );
            },
            minusUserMaterialItems : function(next, res) {
               this.minusUserMaterialItems(evoMaterials, userId, next);
            },
            minusUserMoney : function(next, res) {
                User.update({
                    '_id' : userId
                }, {
                    '$inc': {'money': - moneyCost}
                }, next);
            },
            cardAfterEvo : function(next, res) {
                this.getCardAfterEvo(userCard, card, next);
            },
            deleteUserCard : function(next, res) {
                UserCard.remove({'_id' : userCard._id}, next);
            },
            addUserCardAfterEvo : function(next, res) {
                var userCard = _.extend(
                    {user_id    : userId,}, res.cardAfterEvo
                );
                UserCard.save(userCard, next);
            },
        }, cb);
    },

    /* 卡牌进化总入口
     * @param [String] 用户进化卡牌的user_card_id
     * @param [Array] 用户选择的材料卡牌的 user_card_id集合
     */
    evoUp : function(userCardId, materialUserCardIds, cb) {
        var UserCard = this.model('UserCard');
        var Card = this.model('Card');
        var Evolution = this.model('Evolution');
        var UserItem = this.model('UserItem');
        var User = this.model('User');
        this.series({
            userCard : function(next) {
                UserCard.findById(userCardId, next);
            },
            card : function(next, res) {
                Card.findOne({'card_id' : res.userCard.card_id}, next);
            },
            evolution : function(next, res) {
                Evolution.findOne({'evolution_id' : res.card.evo_id}, next);
            },
            evoMaterials : function(next, res) {
                var materialNum = 10;
                next(null, this.buildEvoMaterials(res.evolution, materialNum));
            },
            user : function(next, res){
                User.findById(res.userCard.user_id, next);
            },
            userItems : function(next, res) {
                UserItem.findIndexBy(
                    'item_id', {'user_id' : res.user._id}, next
                );
            },
            materialUserCards : function(next, res) {
                UserCard.find(
                    {'_id' : {$in : materialUserCardIds}},
                    function(err, userCards) {
                        next(err, _.groupBy(userCards, 'card_id'));
                    }
                );
            },
            canEvoUp : function(next, res) {
                var canEvoUp = this.canEvoUp(
                    res.userCard, res.card, res.evolution,
                    res.user, res.userItems,
                    res.materialUserCards,
                    res.evoMaterials
                );
                if (!canEvoUp) {
                    next(new Error('can not evo up'));
                    return;
                } else {
                    next();
                }
            },
            doEvoUp : function(next, res) {
                this.doEvoUp(
                    res.evoMaterials, materialUserCardIds,
                    res.evolution.money_cost, res.userCard,
                    res.card, next
                );
            },
        }, cb);

    },

    buildEvoMaterials : function(materialObj, length) {
        var result = [];
        for (var i = 1; i <= length; i++) {
            if (materialObj['object' + i + '_type'] <= 0) {
                continue;
            }
            result.push({
                'object_type' : materialObj['object' + i + '_type'],
                'object_id'   : materialObj['object' + i + '_id'],
                'object_num'  : materialObj['object' + i + '_num'],
            });
        }
        return result;
    },

    getUserCards : function(userId, cb) {
        var UserCard = this.model('UserCard');
        UserCard.find({'user_id' : userId}, cb);
    },

    addUserCard : function(userId, cardId, cb) {
        var cardNum = 1;
        this.addUserCards(userId, cardId, cardNum, cb);
    },


    addUserCards: function(userId, cardId, num, cb){
        var Card = this.model('Card');
        this.series({
            card: function(next) {
                Card.findOne({'card_id': cardId}, next);
            },
            add : function(next, res) {
                var userCard = {
                    user_id : userId,
                    card_id : cardId,
                    exp     : 0,
                    level   : res.card.level_default ,
                    hp      : res.card.hp_default    ,
                    attack  : res.card.attack_default,
                    speed   : res.card.speed_default ,
                    luck    : res.card.luck_default  ,
                    cur_hp_egg     : 0,
                    cur_speed_egg  : 0,
                    cur_attack_egg : 0,
                };
                this.seriesAdd(userCard, num, next);
            },
        }, cb);
    },

    seriesAdd : function(userCard, num, cb) {
        var UserCard = this.model('UserCard');
        var tasks = [];
        for (var i = 0; i < num; i++) {
            tasks.push(
                UserCard.getSaveFunc(userCard)
            );
        }
        this.series(tasks, cb);
    },

    levelUp : function(userId, userCardId, materialUserCardIds, cb) {
        var UserCard    = this.model('UserCard');
        var Strengthen  = this.model('Strengthen');
        var Card        = this.model('Card');
        var User        = this.model('User');
        var CardLevel   = this.model('CardLevel');

        var oldLevel, myRarity, myCard;
        this.series({
            user : function(next) {
                User.findById(userId, next);
            },
            userCard : function(next, res) {
                UserCard.findById(userCardId, next);
            },
            materialUserCards : function(next) {
                UserCard.find({'_id': {'$in': materialUserCardIds}}, next);
            },
            cardMap : function(next) {
                Card.findIndexBy('card_id', {}, next);
            },
            strengthenMap : function(next) {
                Strengthen.findIndexBy('rarity', {}, next);
            },
            giveExp : function(next, res) {
                myCard = res.cardMap[res.userCard.card_id];
                var exp = this.computeTotalExp(
                    myCard.card_type,
                    res.materialUserCards,
                    res.cardMap,
                    res.strengthenMap
                );
                res.userCard.exp += exp;//增加新获取的经验
                next();
            },
            successFlag : function(next, res) {
                next(null, this.successFlag);
            },
            updateLevel : function(next, res) {
                myRarity = myCard.rarity;
                oldLevel = res.userCard.level;
                var condition = {};
                condition['card_rarity' + myRarity + '_exp'] = {
                    '$lte': res.userCard.exp,
                };//取经验小于等于exp的最大level
                CardLevel.findOne(condition, null, {'sort': {level: -1}},
                    function(err, cardLevel) {
                        if (cardLevel.level > myCard.level_max) {
                            res.userCard.level = myCard.level_max;
                        } else {
                            res.userCard.level = cardLevel.level;
                        }
                        next(err);
                    }
                );
            },
            updateEgg : function(next, res) {
                this.updateEgg(
                    res.userCard, res.materialUserCards, myCard, res.cardMap
                );
                next();
            },
            updateUserCardAccordingLevel : function(next, res) {
                this.updateUserCardAccordingLevel(res.userCard, myCard);
                next();
            },
            minuxMoney : function(next, res) {
                var strengthen = res.strengthenMap[myRarity];
                var money = this.computeMoneyNeeded(
                    res.materialUserCards.length, strengthen, oldLevel
                );
                if (res.user.money < money) {
                    next(new Error('levelUp: do not have enough money'));
                    return;
                }
                res.user.money -= money;
                res.user.save(next);
            },
            removeMaterials : function(next, res) {
                UserCard.remove({
                    '_id': {'$in': materialUserCardIds}
                }, next);
            },
            saveUserCard : function(next, res) {
                res.userCard.save(next);
            },
        }, function(err, res) {
            logger.info(err);
//            logger.info(res.user);
//            logger.info(res.userCard);
            cb(err, res);
        });
    },

    computeMoneyNeeded : function(materialsLength, strengthen, oldLevel) {
        return strengthen.first_cost_lv1 +
               strengthen.first_cost_lv_factor * (oldLevel - 1) +
               strengthen.next_cost * (materialsLength - 1);
    },

    updateUserCardAccordingLevel: function(userCard, myCard) {
        var newLevel = userCard.level;

        _.each(Const.CardProps, function(p) {
            userCard[p] = this.getNewValueFor(p, newLevel, myCard) +
                          userCard['cur_' + p + '_egg'];
        }.bind(this));
    },

    updateEgg : function(userCard, materialUserCards, myCard, cardMap) {
        _.each(materialUserCards, function(m) {
            logger.info(m.card_id);
            var materialCard = cardMap[m.card_id];
            _.each(Const.CardProps, function(p) {
                userCard['cur_' + p + '_egg'] = _.min([
                    userCard['cur_' + p + '_egg'] + materialCard[p + '_egg'],
                    myCard[p + '_egg_limit']
                ]);
            });
        });
    },

    getNewValueFor : function(property, newLevel, myCard) {
        var max     = myCard[property + '_max'],
            def     = myCard[property + '_default'],
            lvMax   = myCard.level_max;
        if (newLevel === 1) return def;

        return (max - def) / lvMax * (newLevel - 1) + def;
    },

    /*
     * @param  [Integer] cardType
     * @param  [Array]   materials 包含userCard的数组
     * @param  [Object]  cardMap 以card_id为key，对应card为值的map
     * @param  [Object]  strengthenMap 以rarity为key，对应strengthen为值的map
     *
     * @return [Object] 根据materials可得的所有经验
     */
    computeTotalExp: function(cardType, materials, cardMap, strengthenMap) {
        var totalExp = 0;
        _.each(materials, function(materialUserCard) {
            var rarity = cardMap[materialUserCard.card_id].rarity;
            var strengthen = strengthenMap[rarity];
            totalExp += this.computeExp(
                cardType, strengthen, materialUserCard, cardMap
            );
        }.bind(this));

        return totalExp;
    },

    //如果cardType相同，则乘以相应加成系数
    //有一定概率获得大小成功加成
    computeExp : function(cardType, strengthen, materialUserCard, cardMap) {
        var materialCard = cardMap[materialUserCard.card_id];
        var baseExp = this.computeBaseExp(
            materialCard, materialUserCard.level, strengthen
        );

        var resultExp = baseExp;
        if (cardType == materialCard.card_type) {//相同类型加成
            resultExp *= Const.Strengthen.SameTypeExpFactor;
        }
        //大小成功加成
        resultExp = parseInt(resultExp * this.getSuccessExpFactor());

        return resultExp;
    },

    //基础经验计算：如果材料卡material_exp字段有定义，则直接返回
    //否则使用材料卡的等级乘以strengthen.material_exp_lv1常数
    computeBaseExp: function(materialCard, materialUserCardLevel, strengthen) {
        if (materialCard.material_exp > 0) {
            return materialCard.material_exp;
        } else {
            return materialUserCardLevel * strengthen.material_exp_lv1;
        }
    },

    getSuccessExpFactor : function() {
        var randProb = (new Random()).nextInt(100);//概率
        var noSuccessProb = Const.Strengthen.GreatSuccessProb +
                            Const.Strengthen.SmallSuccessProb;
        if (randProb <= Const.Strengthen.GreatSuccessProb) {
            this.successFlag = 2;//大成功
            return Const.Strengthen.GreatSuccessExpFactor;//2
        } else if (randProb > noSuccessProb) {
            return 1;//no factor
        } else {
            this.successFlag = 1;//小成功
            return Const.Strengthen.SmallSuccessExpFactor;//1.5
        }
    },
});
