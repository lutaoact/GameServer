var assert = require('assert');
var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var UserService = AsyncClass.service('UserService');

var userId1 = '111111111111111111111111';
var userId2 = '111111111111111111111112';
describe('UserService', function() {
     describe('#getUser()', function() {
        it('should run well', function(done) {
            UserService.getUsers([userId1, userId2], done);
        });
    });

});
