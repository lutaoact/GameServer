var BaseModel = require('./BaseModel').BaseModel;

exports.DataVersion = BaseModel.subclass({
    classname : 'DataVersion',

    initialize: function($super) {
        this.schema = {
        };
        this.schemaParams = {
            versionKey : 'version',
        };
        $super();
    },

    increment: function(cb) {
        this.findOne({}, function(err, doc) {
            doc.increment();
            doc.save(cb);
        });
    },
});
