const pool = require('./pool');
const bcrypt = require('bcrypt');

function loginUser(username, password, callback) {
    if (!username || !password) {
        return callback('Vui lòng nhập đầy đủ thông tin', null);
    }

    if (password.length <= 8) {
        return callback('Mật khẩu phải có ít nhất 8 ký tự', null);
    }

    pool.query('SELECT Password FROM user WHERE Username = ?', [username], (error, results) => {
        if (error) {
            return callback('Đã xảy ra lỗi khi đăng nhập', null);
        }

        if (results.length === 0) {
            return callback('Tài khoản không tồn tại', null);
        }

        const hashed_mk = results[0].Password;

        bcrypt.compare(password, hashed_mk, (err, result) => {
            if (err) {
                return callback('Đã xảy ra lỗi khi đăng nhập', null);
            }

            if (result) {
                // Correct password
                return callback(null, username);
            } else {
                // Incorrect password
                return callback('Tài khoản hoặc mật khẩu không đúng', null);
            }
        });
    });
}

module.exports = loginUser;
