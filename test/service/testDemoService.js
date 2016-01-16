var assert = require('assert');

var DemoService = require('../../app/service/DemoService').DemoService;

describe('DemoService', function() {
    describe('#isRunning()', function() {
        it('should return not null Object', function(done) {
            (new DemoService()).isRunning(function(err, res) {
            	assert.ifError(err);
                done();
            });
        });
    });
    describe('#model()', function() {
        it('should run well', function() {
            var Card = (new DemoService()).model('Card');
            assert.equal(typeof Card, typeof {});
        });
    });
    describe('#service()', function() {
        it('should run well', function() {
            var BaseService = (new DemoService()).service('BaseService');
            assert.equal(typeof BaseService, typeof {});
        });
    });
});
