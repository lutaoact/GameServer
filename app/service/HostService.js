var BaseService = require('./BaseService').BaseService;

exports.HostService = BaseService.subclass({
    classname: 'HostService',

    initialize: function() {
    },

    recordHost: function(hostname, port, cb) {
        var Host = this.model('Host');
        this.waterfall([
            function(next) {
                Host.findOne({
                    'hostname'  : hostname,
                    'port'      : port,
                }, next);
            },
             function(res, next) {
                 if (res) {
                     res.update({
                         'is_valid'     : 1,
                         'updated_at'    : _u.time(),
                     }, next);
                 } else {
                     var data = {
                         'hostname'  : hostname,
                         'port'      : port,
                         'is_valid'  : 1,
                     };
                     Host.save(data, next);
                 }
             },
        ],  function(err, res){
            cb(err, res);
        });
    },
});
