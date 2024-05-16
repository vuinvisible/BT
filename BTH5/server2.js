// const formidable = require('formidable');
// const http = require('http');
// const util = require('util');
// const fs = require('fs');

// http.createServer(function(req, res) {
//     if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
//         const form = new formidable.IncomingForm({
//             maxFileSize: 10 * 1024 * 1024
//         });

//         form.parse(req, function(err, fields, files) {
//             if (err) {
//                 // Ghi log lỗi vào file
//                 fs.appendFile('error.log', '[' + new Date() + '] ' + err.message + '\n', function(err) {
//                     if (err) console.error('Error writing to error log:', err);
//                 });

//                 res.writeHead(500, {'content-type': 'text/plain'}); 
//                 res.end('Error occurred: ' + err.message);
//                 return;
//             }

//             if (!files.upload || !files.upload.path) {
//                 res.writeHead(400, {'content-type': 'text/plain'}); 
//                 res.end('No file uploaded.');
//                 return;
//             }

//             var oldPath = files.upload.path;
//             var newPath = './uploads/' + files.upload.name;

//             fs.rename(oldPath, newPath, function(err) {
//                 if (err) {
//                     fs.appendFile('error.log', '[' + new Date() + '] ' + err.message + '\n', function(err) {
//                         if (err) console.error('Error writing to error log:', err);
//                     });

//                     res.writeHead(500, {'content-type': 'text/plain'}); 
//                     res.end('Error occurred: ' + err.message);
//                     return;
//                 }

//                 res.writeHead(200, {'content-type': 'text/plain'}); 
//                 res.write('File uploaded and moved!');
//                 res.end();
//             });
//         });

//         return;
//     }

//     res.writeHead(200, {'content-type': 'text/html'}); 
//     res.end(
//         '<form action="/upload" enctype="multipart/form-data" method="post">' + 
//         '<input type="file" name="upload" multiple="multiple"><br>' +
//         '<input type="submit" value="Upload">' +
//         '</form>'
//     );
// }).listen(8080);


const express = require('express');
const formidable = require('formidable');
const fs = require('fs');

const app = express();

// Middleware để xử lý các request có dạng multipart/form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm({
        maxFileSize: 10 * 1024 * 1024
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            logError(err.message);
            return res.status(400).send('Error occurred: ' + err.message);
        }

        if (!files.upload || !files.upload.path) {
            const error = new Error();
            return res.status(500).send(error.message);
            // return res.status(400).send('No file uploaded.');
        }

        const oldPath = files.upload.path;
        const newPath = './uploads/' + files.upload.name;

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                logError(err.message);
                return res.status(500).send('Error occurred: ' + err.message);
            }

            res.status(200).send('File uploaded and moved!');
        });
    });
});

app.get('/', (req, res) => {
    res.send(
        '<form action="/upload" enctype="multipart/form-data" method="post">' + 
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
});

function logError(errorMessage) {
    fs.appendFile('error.log', '[' + new Date() + '] ' + errorMessage + '\n', (err) => {
        if (err) console.error('Error writing to error log:', err);
    });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
