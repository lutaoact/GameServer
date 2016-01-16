var BaseService = require('./BaseService').BaseService;
var _ = require('underscore');

exports.TextService = BaseService.subclass({
    classname: 'TextService',

    getAll : function(cb) {
        var Text = this.model('Text');
        Text.findAll(cb);
    },
});
