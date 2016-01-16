var assert = require('assert');

var AreaService = new (require('../../app/service/AreaService').AreaService);

describe('AreaService', function() {
    describe('#model()', function() {
        it('should run well', function() {
            var Card = AreaService.model('Card');
            assert.equal(typeof Card, typeof {});
        });
    });
    describe('#service()', function() {
        it('should run well', function() {
            var BaseService = AreaService.service('BaseService');
            assert.equal(typeof BaseService, typeof {});
        });
    });
});
