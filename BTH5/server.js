let http = require("http");
let url = require("url");
let fs = require("fs");
let formidable = require("formidable");
let path = require("path");

let server = http.createServer((req, res) => {
  if (req.url == "/upload" && req.method.toLocaleLowerCase() == "post") {
    let form = new formidable.IncomingForm();
    form.uploadDir = "uploads/";
    form.keepExtensions = true; // Giữ phần mở rộng của tệp

    form.fileFilter = function (req, file, callback) {
      // Chấp nhận tất cả các loại tệp tin
      callback(null, true);
    };

    form.parse(req, (err, fields, files) => {
      if (err) throw err;

    //   console.log("Files object:", files); //Trong files khi gửi từ client: fileupload
      if (!files || !Array.isArray(files.fileupload) || files.fileupload.length === 0) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid upload request.");
        return;
      }

      let uploadedFile = files.fileupload[0];

      let tmpPath = uploadedFile.filepath;
      let newPath = form.uploadDir + uploadedFile.originalFilename; // Sử dụng tên gốc của tệp tin

      try {
        fs.renameSync(tmpPath, newPath);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(`Upload file <strong>${uploadedFile.originalFilename}</strong> successfully`);

        // Hoãn 10 giây trước khi quay lại trang trước
        res.write("<script>setTimeout(function() { window.history.back(); }, 10000);</script>");
        res.end();
      } catch (err) {
        console.error('Error moving uploaded file:', err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end('Failed to upload file');
      }
    });
    return;
  }

  let urlData = url.parse(req.url, true);
  let fileName = "./views" + urlData.pathname;
  if (urlData.pathname === "/") fileName = "./views/master.html";
  fs.readFile(fileName, (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write("404 Not Found");
      return res.end();
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
});

server.listen(8017, 'localhost', () => {
  console.log(`Server running at localhost:8017/`);
});