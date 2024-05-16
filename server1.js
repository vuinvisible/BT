// server.js
const fs = require('fs');
let fileContent = 'Ragdoll, Scottish fold, British shorthair...';
let filePath = 'BTH3/cats.txt';
fs.writeFile(filePath, fileContent, (err) => {
    if(err) throw err;
        console.log('The file was successfully saved.');
});
//end

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



