var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');
var Const = require('../../lib/Const');
var Random = require('../../lib/mt').MersenneTwister;
var time = require('../../lib/util').time;

exports.MissionService = BaseService.subclass({
    classname: 'MissionService',

    startMission: function(userId, missionId, userCardIds, cb) {
        var UserService = this.service('UserService');
        this.series({
            mission: function(next) {
                this.getMission(missionId, next);
            },
            updateEnergy: function(next, res) {
                UserService.updateEnergy(
                    userId, res.mission.energy_cost, next
                );
            },
        }, cb);
    },

    finishMission: function(userId, missionId, userCardIds, cb) {
        this.series({
            mission: function(next) {
                this.getMission(missionId, next);
            },
            missionItem : function(next, res) {
                this.getMissionItem(res.mission.mission_item_id, next);
            },
            rewards: function(next, res) {
                this.getRewards(
                    userId, missionId, res.missionItem, userCardIds, next
                );
            },
            giveFinishMissionRewards: function(next, res) {
                this.giveRewards(userId, res.rewards, next);
            },
            upsertUserMission : function(next, res) {
                this.upsertUserMission(userId, missionId, next);
            },
        }, cb);
    },

    upsertUserMission : function(userId, missionId, cb) {
        var UserMission = this.model('UserMission');
        var now = time();
        this.series({
            userMission : function(next) {
                UserMission.findOne({
                    'user_id'    : userId,
                    'mission_id' : missionId
                }, next);
            },
            upsert: function(next, res) {
                if (res.userMission) {
                    res.userMission.update({
                        '$inc': {'clear_num': 1},
                        'updated_at' : now,
                    }, next);
                } else {
                    var data = {
                        user_id        : userId,
                        mission_id     : missionId,
                        clear_num      : 1,
                        first_clear_at : now,
                    };
                    UserMission.save(data, next);
                }
            },
        }, cb);
    },

    giveRewards : function(userId, rewards, cb) {
        var CardService = this.service('CardService');
        var ItemService = this.service('ItemService');
        this.eachSeries(rewards, function(reward, next) {
            switch (reward.object_type) {
                case Const.ObjectType.Item:
                    ItemService.addUserItem(
                        userId, reward.object_id, reward.object_num, next
                    );
                    break;
                case Const.ObjectType.Card:
                    CardService.addUserCards(
                        userId, reward.object_id, reward.object_num, next
                    );
                    break;
                default:
                    next();
            }
        }, cb);
    },

    getRewards : function(userId, missionId, missionItem, userCardIds, cb) {
        this.series({
            firstOnlyRewards : function(next, res) {
                this.getFirstOnlyRewards(
                    userId, missionId, missionItem, next
                );
            },
            normalRewards: function(next, res) {
                this.getNormalRewards(missionItem, next);
            },
            luckRewards: function(next, res) {
                var firstUserCardId = userCardIds[0];
                this.getLuckRewards(
                    missionItem.mission_luck_id, firstUserCardId, next
                );
            },
        }, function(err, res) {
            cb(err, res.firstOnlyRewards.concat(res.normalRewards)
                                        .concat(res.luckRewards)
            );
        });
    },

    getLuckRewards : function(missionLuckId, userCardId, cb) {
        this.series({
            canGiveLuckRewards : function(next) {
                this.canGiveLuckRewards(userCardId, next);
            },
            luckRewards : function(next, res) {
                if (!res.canGiveLuckRewards) {
                    next(null, []);
                    return;
                }

                this.buildLuckRewards(missionLuckId, next);
            },
        }, function(err, res) {
            cb(err, res.luckRewards);
        });
    },

    buildLuckRewards: function(missionLuckId, cb) {
        var MissionLuck = this.model('MissionLuck');
        var self = this;
        MissionLuck.findOne(
            {'mission_luck_id' : missionLuckId},
            function(err, missionLuck) {
                cb(err, self.buildRewards(
                    missionLuck, Const.LuckRewardsLength
                ));
            }
        );
    },

    canGiveLuckRewards: function(userCardId, cb) {
        var UserCard = this.model('UserCard');
        var rand = new Random();
        UserCard.findOne({'_id': userCardId}, function(err, uc) {
            var randLuck = rand.nextInt(Const.MaxLuck);
            cb(err, randLuck >= uc.luck);
        });
    },

    getNormalRewards: function(missionItem, cb) {
        var rewards = this.buildRewards(
            missionItem, Const.NormalRewardsLength
        );
        cb(null, rewards);
    },

    buildRewards : function(rewardObj, length) {
        var result = [];
        for (var i = 1; i <= length; i++) {
            if (rewardObj['object' + i + '_type'] <= 0) {
                continue;
            }
            result.push({
                'object_type' : rewardObj['object' + i + '_type'],
                'object_id'   : rewardObj['object' + i + '_id'],
                'object_num'  : rewardObj['object' + i + '_num'],
            });
        }
        return result;
    },

    getFirstOnlyRewards : function(userId, missionId, missionItem, cb) {
        this.series({
            isFirstClear: function(next) {
                this.isFirstClear(userId, missionId, next);
            },
            rewards : function(next, res) {
                if (!res.isFirstClear || !missionItem.first_only) {
                    next(null, []);
                    return;
                }
                next(null, this.buildFirstOnlyRewards(missionItem));
            },
        }, function(err, res) {
            cb(err, res.rewards);
        });
    },

    buildFirstOnlyRewards : function(missionItem) {
        var firstOnlyRewards = [];
        for (var i = 1; i <= Const.FirstOnlyRewardsLength; i++) {
            if (missionItem['first_object' + i + '_type'] <= 0) {
                continue;
            }
            firstOnlyRewards.push({
                'object_type' : missionItem['first_object' + i + '_type'],
                'object_id'   : missionItem['first_object' + i + '_id'],
                'object_num'  : missionItem['first_object' + i + '_num'],
            });
        }
        return firstOnlyRewards;
    },

    getMission : function(missionId, cb) {
        var Mission = this.model('Mission');
        Mission.findOne({'mission_id' : missionId}, cb);
    },

    getMissionItem : function(missionItemId, cb) {
        var MissionItem = this.model('MissionItem');
        MissionItem.findOne({'mission_item_id' : missionItemId}, cb);
    },

    //若user_mission中记录为空，则为第一次完成mission
    isFirstClear : function(userId, missionId, cb) {
        var UserMission = this.model('UserMission');
        UserMission.findOne({
            'user_id'    : userId,
            'mission_id' : missionId
        }, function(err, result) {
            cb(err, _.isEmpty(result));
        });
    },

    getAreaUserMissions : function(userId, areaId, cb) {
        var UserMission = this.model('UserMission');
        this.series({
            missions: function(next, res) {
                this.getMissionsByAreaId(areaId, next);
            },
            userMissions : function(next, res) {
                var missionIds = _.pluck(res.missions, 'mission_id');
                UserMission.find({
                    user_id: userId,
                    mission_id : {'$in' : missionIds}
                }, null, {lean : true}, next);
            },
        }, function(err, res) {
            var columns = ['mission_id', 'clear_num', 'first_clear_at'];
            cb(err, _u.arrayPick(res.userMissions, columns));
        });
    },

    getMissionsByAreaId : function(areaId, cb) {
        var Zone = this.model('Zone');
        var Mission = this.model('Mission');
        this.series({
            zones : function(next) {
                Zone.find({'area_id': areaId}, next);
            },
            missions: function(next, res) {
                var zoneIds = _.pluck(res.zones, 'zone_id');
                Mission.find({'zone_id': {'$in': zoneIds}}, next);
            },
        }, function(err, res) {
            cb(err, res.missions);
        });
    },
});
