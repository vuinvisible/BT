const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Sử dụng middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Tạo transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kpsportshop1234@gmail.com',
    pass: 'wvatnjzlfzdwzrkw'
  }
});

// Xử lý yêu cầu GET tới đường dẫn gốc
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sendmail1.html'));
});

// Xử lý yêu cầu POST từ form
app.post('/send-email', (req, res) => {
  const { recipientEmail, message } = req.body;

  // Tạo đối tượng mailOptions từ dữ liệu form
  const mailOptions = {
    from: 'kpsportshop1234@gmail.com',
    to: recipientEmail,
    subject: 'Gửi mail bằng Node.js',
    html: `<p>${message}</p>`
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Có lỗi xảy ra khi gửi email');
    } else {
      console.log('Email đã được gửi: ' + info.response);
      res.send('Email đã được gửi thành công');
    }
  });
});

app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});