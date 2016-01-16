var assert = require('assert');
var fs = require('fs');

describe('Array', function() {
    beforeEach(function() {
        //console.log('beforeEach Array');
    });

    before(function() {
        //console.log('before Array');
    });

    before(function() {
        //console.log('before Array second time');
    });

    after(function() {
        //console.log('after Array');
    });

    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
            assert.equal(1, '1');
        });
        it('should return -1 when the value is not present', function() {
//            assert.equal(-1, [1, 2, 3].indexOf(5));
//            assert.equal(-1, [1, 2, 3].indexOf(0));
//            assert.equal(1, '1');
        });
    });

    describe('File', function() {
        beforeEach(function() {
            //console.log('beforeEach file test');
        });

        afterEach(function() {
            //console.log('afterEach file test');
        });

        describe('#readFile()', function() {
            it('should read app.js without error', function(done) {
                fs.readFile('app.js', function(err) {
                    if (err) throw err;
                    done();
                });
            });
            it('should read test.js without error', function(done) {
                done();
            });
        });
    });
});

