// // server.js
// const fs = require('fs');
// let fileContent = 'Ragdoll, Scottish fold, British shorthair...';
// let filePath = 'BTH3/cats.txt';
// fs.writeFile(filePath, fileContent, (err) => {
//     if(err) throw err;
//         console.log('The file was successfully saved.');
// });
// //end

//Doc file
// const server = http.createServer((req, res) => {
//     let filePath = 'views/cat.html';
//     fs.readFile(filePath, (err, data) => {
//         if(err) throw err;
//         res.writeHead(200, {'Content-Type':'text/html'});
//         res.write(data);
//         res.end();
//     });
// });

// server.listen(8017, 'localhost');

// server.js
const fs = require('fs');
let base64String =
"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 \
yfs/vJhTo2p3GXYAAAAASUVORK5CYII=";
let fileContentBuffer = Buffer.from(base64String, "base64");
let filePath = 'BTH3/cat.png';
fs.writeFile(filePath, fileContentBuffer, (err) => {
    if(err) throw err;
    console.log('The file was successfully saved.');
});
//end

//Cap nhat file
// let content = 'Korat cat';
// let filePath = 'cats.txt'
// fs.appendFile(filePath, content, (err) => {
//     if(err) throw err;
//     console.log('The file was successfully updated.')
// });

//Doi ten file
// fs.rename('cats.txt', 'monleo.txt', (err) => {
//     if(err) throw err;
//     console.log('The file was successfully renamed.')
// });

//Xoa file
// fs.unlink('monleo.txt', (err) => {
//     if(err) throw err;
//     console.log('The file was successfully deleted.')
// });



