var assert = require('assert');

var ItemService = require('../../app/service/ItemService').ItemService;

describe('ItemService', function() {
    describe('#model()', function() {
        it('should run well', function() {
            var Card = (new ItemService()).model('Card');
            assert.equal(typeof Card, typeof {});
        });
    });
    describe('#service()', function() {
        it('should run well', function() {
            var BaseService = (new ItemService()).service('BaseService');
            assert.equal(typeof BaseService, typeof {});
        });
    });
});
