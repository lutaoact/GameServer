var BaseController = require('../controller/BaseController').BaseController;
var fs = require('fs');
var http = require('http');

exports.UpDataController = BaseController.subclass({
    classname: 'UpDataController',

    initialize: function($super) {
        $super();
    },

    uploadIndex: function(request, response) {
        response.render('upload_index', {});
    },

    upload: function(request, response) {
        //获得文件的临时路径
        var tmp_path = request.files.thumbnail.path;
        // 指定文件上传后的目录 - 示例为"images"目录。
        var target_path = '/data/tmp/master_data.xlsx';
        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            fs.unlink(tmp_path, function() {
                if (err) throw err;
            });
        });

        var options = {
            host: 'localhost',
            port: '8080',
            path: '/job/FTOpe/build'
        };

        http.get(options, function(res){
            response.redirect('http://' + request.host+':8080/job/FTOpe/');
        }).on('error', function(e){
            response.send('Failed to access jenkins '+e.message);
        });
    },
});

exports.routes = {
    GET : {
        '/upload_index': exports.UpDataController.createAction('uploadIndex'),
    },
    POST: {
        '/upload': exports.UpDataController.createAction('upload'),
    },
};
