const pool = require('./pool')
const nodemailer = require('nodemailer')

function forgotPass(email, callback) {
  if (!email) {
    return callback('Vui lòng nhập đầy đủ thông tin', null);
  }

  // Kiểm tra định dạng email
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return callback('Email không đúng định dạng', null);
  }

  try {
    pool.query('SELECT Email FROM user WHERE Email = ?', email, (error, result) => {
      if (error) {
        return callback('Đã xảy ra lỗi khi kiểm tra dữ liệu', null);
      }

      if (result.length === 0) {
        return callback('Email không tồn tại', null);
      }

      let token = '';
      const tokenLength = 6;
      const chars = '0123456789';
      for (let i = 0; i < tokenLength; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Thêm token vào bảng reset_pass
      const sql = "INSERT INTO reset_pass (Email, Token) VALUES (?, ?)";
      pool.query(sql, [email, token], (err, result) => {
        if (err) {
          return callback('Đã xảy ra lỗi khi gửi email', null);
        }

        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'kpsportshop1234@gmail.com',
            pass: 'wvatnjzlfzdwzrkw'
          }
        });

        var mailOptions = {
          from: 'Chat Real-Time',
          to: email,
          subject: 'Xác nhận đặt lại mật khẩu',
          html: `Mã xác nhận để đặt lại mật khẩu của bạn là: <strong>${token}</strong>. Mã này sẽ hết hạn sau một khoảng thời gian.`
        };

        transport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error('Lỗi khi đang gửi mail: ', error);
            return callback('Đã xảy ra lỗi khi gửi email', null);
          } else {
            console.log('Email đã gửi: ', info.response);
            return callback(null, email); // Trả về email thành công
          }
        });
      });
    });
  } catch (err) {
    console.error('Cơ sở dữ liệu lỗi: ', err);
    return callback('Đã xảy ra lỗi khi kiểm tra dữ liệu', null);
  }
}

module.exports = forgotPass;