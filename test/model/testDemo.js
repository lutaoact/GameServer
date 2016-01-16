var assert = require('assert');

var Demo = require('../../app/model/Demo').Demo;

describe('Demo', function() {
    describe('#add()', function() {
        it('should add success', function(done) {
            var data = {name : "test", description: "i am a test"};
            (new Demo()).validate(data, function(err, res) {
                assert.ifError(err);
                done();
            });
        });
    });
    describe('#add2()', function() {
        it('should add success', function(done) {
            var data = {name : "test", description: null};
            (new Demo()).save(data, function(err, res) {
                assert.ifError(err);
                done();
            });
        });
    });
    describe('#findAll()', function() {
        it('should add success', function(done) {
            var data = {name : "test", description: "i am a test"};
            (new Demo()).findAll( function(err, res) {
                assert.ifError(err);
                done();
            });
        });
    });

});
