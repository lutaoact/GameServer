package CodeTemplate;
use warnings;
use strict;

my $config;

BEGIN {

$config = {
    TMPL => {
        model      => model_tmpl(),
        service    => service_tmpl(),
        controller => controller_tmpl(),
        test_model   => test_model_tmpl(),
        test_service => test_service_tmpl(),
    },
};

sub service_tmpl {
    return <<'HERE';
var BaseService = require('./BaseService').BaseService;

exports.%s = BaseService.subclass({
    classname: '%s',
});
HERE
}

sub controller_tmpl {
    return <<'HERE';
var BaseController = require('./BaseController').BaseController;

exports.%s = BaseController.subclass({
    classname: '%s',
});

exports.routes = {
    GET : {
        '' : exports.%s.createAction(''),
    },
    POST: {
        '' : exports.%s.createAction(''),
    },
};
HERE
}

sub model_tmpl {
    return  <<'HERE';
var BaseModel = require('./BaseModel').BaseModel;

exports.%s = BaseModel.subclass({
    classname : '%s',

    initialize: function($super) {
        this.schema = {
        };
        $super();
    },
});
HERE
}

sub test_service_tmpl {
    return <<'HERE';
var assert = require('assert');
var async = require('async');
var loadTestData = require('../lib/loadTestData');

var AsyncClass = new (require('../../lib/AsyncClass').AsyncClass);
var %s = AsyncClass.service('%s');
var userId = '111111111111111111111111';

describe('%s', function() {
    describe('#add()', function() {
        it('should add success', function(done) {
            runTest(done);
        });
    });
});

function runTest(done) {
    async.waterfall([
        function(next) {
            loadTestData('default', next);
        },
        function(data, next) {
            next();//add what you need here
        },
    ], function(err, res) {
        assert.ifError(err);
        done();
    });
}
HERE
}

sub test_model_tmpl {
    return <<HERE;
var assert = require('assert');
var async = require('async');

var %s = new (require('../../app/model/%s').%s);

var data = {
};

describe('%s', function() {
    describe('#add()', function() {
        it('should run success', function(done) {
            runTest(done);
        });
    });
});

function runTest(cb) {
    async.series([
        function(next) {
            %s.remove({}, next);
        },
        function(next) {
            %s.save(data, next);
        },
        function(next) {
            %s.findAll(next);
        }
    ], function(err, res) {
        assert.ifError(err);
        cb();
    });
}
HERE
}

}#complete BEGIN block

use constant $config;
our @EXPORT_OK = keys %{$config};

1;
