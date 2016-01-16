var assert = require('assert');

var RegionService = new (require('../../app/service/RegionService').RegionService);

describe('RegionService', function() {
    describe('#model()', function() {
        it('should run well', function() {
            var Card = RegionService.model('Card');
            assert.equal(typeof Card, typeof {});
        });
    });
    describe('#service()', function() {
        it('should run well', function() {
            var BaseService = RegionService.service('BaseService');
            assert.equal(typeof BaseService, typeof {});
        });
    });
});
