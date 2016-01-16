var BaseService = require('./BaseService').BaseService;
var RoomMembersCachePrefix =  "room.members:";

exports.RoomService = BaseService.subclass({
    classname: 'RoomService',

    addRoom : function(userId, gps, maxNum, cb) {
        var Room = this.model('Room');

        this.series({
            host : function(next) {
                this.chooseHost(next);
            },
            room : function(next, res) {
                var data = {
                    host_id : res.host._id,
                    gps : gps,
                    owner_id : userId,
                    max_num : maxNum,
                    status : Const.RoomStatus.Waiting,//0:队友募集中
                    members : [],//新建房间没有成员
                    random_seed : _u.time(),
                };
                Room.save(data, next);
            },
        }, function(err, res) {
            cb(err, {
                room_id : res.room._id,
                hostname : res.host.hostname,
                port : res.host.port,
                random_seed : res.room.random_seed,
            });
        });
    },

    getRoomById : function(roomId, cb) {
        this.model('Room').findOne({'_id': roomId}, cb);
    },

    findNearValiadRoomsWithHostName : function(gps, cb){
        this.series({
            rooms: function(next) {
                this.findNearValidRooms(gps, next);
            },
            users: function(next, res){
                var UserService = this.service('UserService');
                UserService.getUsers(
                    _.pluck(res.rooms, 'owner_id'), next
                );
            },
            hosts: function(next, res){
                this.getAllValidHosts(next);
            },
        }, function(err, res){
            var roomWithHost = this.buildRoomWithHost(res.rooms, res.hosts);
            var roomWithNickName =
                this.buildRoomWithNickName(res.rooms, res.users);

            cb(err, roomWithNickName);
        });
    },

    buildRoomWithNickName : function(rooms, users){
        var userMap = _.indexBy(users, '_id');
        var roomWithNickName = _.map(rooms, function(room) {
            if(userMap[room.owner_id]) {
                room.owner_nickname = userMap[room.owner_id].nickname;
                return room;
            }
        });

        return roomWithNickName;
    },

    buildRoomWithHost : function(rooms, hosts){
        var hostMap = _.indexBy(hosts, '_id');
        var result = _.filter(rooms, function(room) {
            if (hostMap[room.host_id]) {
                room.hostname   = hostMap[room.host_id].hostname;
                room.port       = hostMap[room.host_id].port;
            }
            return hostMap[room.host_id];
        });

        return result;
    },

    getAllValidHosts : function(cb){
        this.model('Host').findAllValid(cb);
    },

    findNearValidRooms : function(gps, cb) {
        this.model('Room').findNearValid(gps, cb);
    },

    chooseHost : function(cb) {
        this.model('Host').findAllValid(function(err, hosts) {
            cb(err, _.sample(hosts));
        });
    },

    getRoomAllMembers : function(roomId, cb) {
        this.model('Room').findOne({'_id': roomId}, function(err, room) {
            cb(err, room.members);
        });
    },

    getRoomAllMembersFromCache : function(roomId, cb) {
        var Room = this.model('Room');

        Room.findCache(RoomMembersCachePrefix + roomId, function(next) {
            this.getRoomAllMembers(roomId, next);
        }.bind(this), cb);
    },

    addMember : function(roomId, memberId, cb) {

        this.model('Room').update({
            '_id': roomId,
        }, {
            '$addToSet' : {members : memberId}
        }, function(err) {
            LocalCache.delete(RoomMembersCachePrefix + roomId);
            cb(err);
        });
    },

    deleteMember : function(roomId, memberId, cb) {

        this.model('Room').update({
            '_id': roomId,
        }, {
            '$pull' : {members : memberId}
        }, function(err) {
            LocalCache.delete(RoomMembersCachePrefix + roomId);
            cb(err);
        });
    },

    /*
     * 若用户本就是该房间的人，则可重复加入
     * 房间状态不为等待或者人数已满时，不可加入
     */
    canJoin : function(room, userId, cb) {
        if (_.contains(room.members, userId)) {
            cb();
            return;
        }

        if (room.status !== Const.RoomStatus.Waiting) {
            cb({
                err_code : ErrCode.RoomIsNotWaiting,
                err_msg  : 'room status is not waiting',
            });
            return;
        }

        if (room.members.length >= Const.RoomMaxNum) {
            cb({
                err_code : ErrCode.RoomIsFull,
                err_msg  : 'room is full',
            });
            return;
        }

        cb();
    },

    setRoomStatus : function(roomId, status, cb){
        this.model('Room').update({
            '_id' : roomId,
        }, {
            'status' : status
        }, function(err) {
            cb(err);
        });
    },

    appendRoomMemberUser : function(room, userId, cb) {
        var allMembers =  _.union(room.members, [userId]);
        var UserService = this.service('UserService');
        this.series({
            users : function(next) {
                UserService.getUsers(allMembers,next);
            },
        } , function(err, res) {
            var allMembersWithNickName = _.map(res.users, function(user) {
                if(user){
                    nickname = user.nickname ? user.nickname : "";
                    return {
                        user_id     : user._id,
                        nickname    : nickname,
                    }
                }
            });
            cb(err, allMembersWithNickName);
        });
    },

});
