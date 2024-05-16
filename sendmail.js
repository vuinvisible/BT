var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kpsportshop1234@gmail.com',
    pass: 'wvatnjzlfzdwzrkw'
  }
});

var mailOptions = {
  form: 'kpsportshop1234@gmail.com',
  to: 'tranthuan16102003@gmail.com',
  subject: 'Sending Email using Node.js',
  html: '<h1>Welcome</h1><p>Hay du z choi oi =))!</p>'
};

transporter.sendMail(mailOptions, function(err, info) {
  if(err)
    console.log(err);
  else
    console.log('Email sent: ' + info.response);;
});