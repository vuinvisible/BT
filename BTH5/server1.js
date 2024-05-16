var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

var app = express();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var storage = multer.diskStorage({
    // destination: function(req, file, callback) {
    //     fs.mkdir('.uploads', function(err){
    //         if(err) {
    //             console.log(err.stack);
    //         }
    //         else {
    //             callback(null, '.uploads');
    //         }
    //     })
    // },

    // filename: function(req, file, callback) {
    //     callback(null, file.fieldname + '-' + Date.now());
    // }

    destination: function(req, file, callback) {
        callback(null, 'uploads'); // Thư mục trên server để lưu tập tin
    },
    filename: function(req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        callback(null, file.originalname); // Sử dụng tên file gốc
    }
});

app.post('/api/file', function(req, res) {
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File uploaded successfully');
    });
});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});