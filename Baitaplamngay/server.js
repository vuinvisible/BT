const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const urlData = url.parse(req.url, true);
    let fileName = "./views" + urlData.pathname;

    if (urlData.pathname === "/") 
        fileName = "./views/index.html";

    if (req.url == '/mobile.html' || req.url == '/laptop.html') {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.write("404 Not Found");
                return res.end();
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        })
    } else {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.write("404 Not Found");
                return res.end();
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        })
    }
});

server.listen(8017, 'localhost', () => {
    console.log('Server is running on port 8017');
});
