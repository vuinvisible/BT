const pool = require('./pool');
const bcrypt = require('bcrypt');

function registerUser(username, password, repass, email, callback) {
    // Kiểm tra dữ liệu từ biểu mẫu
    if (!username || !password || !repass || !email) {
        return callback('Vui lòng nhập đầy đủ thông tin', null);
    }

    // Kiểm tra mật khẩu có đủ độ dài không
    if (password.length <= 8) {
        return callback('Mật khẩu phải có ít nhất 8 ký tự', null);
    }

    //Kiểm tra mật khẩu có đủ chữ hoa, chữ thường, chữ số và kí tự đặc biệt
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(password)) {
        return callback('Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt', null);
    }

    // Kiểm tra mật khẩu nhập lại có khớp không
    if (password !== repass) {
        return callback('Mật khẩu nhập lại không khớp', null);
    }

    // Kiểm tra định dạng email
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return callback('Email không đúng định dạng', null);
    }

    // Kiểm tra xem email đã tồn tại hay chưa
    pool.query('SELECT Email FROM user WHERE Email = ?', email, (error, results) => {
        if (error) {
            return callback('Đã xảy ra lỗi khi kiểm tra dữ liệu', null);
        }

        if (results.length > 0) {
            return callback('Email đã được sử dụng', null);
        }

        // Mã hóa mật khẩu
        const hashed_pass = bcrypt.hashSync(password, 10);

        // Thêm dữ liệu vào bảng user trong cơ sở dữ liệu
        const sql = `INSERT INTO user (Username, Password, Email) VALUES (?, ?, ?)`;
        pool.query(sql, [username, hashed_pass, email], (err, result) => {
            if (err) {
                return callback('Đã xảy ra lỗi khi đăng ký tài khoản', null);
            }
            return callback(null, 'Đăng ký tài khoản thành công');
        });
    });
}

module.exports = registerUser;
