const pool = require('./pool');
const bcrypt = require('bcrypt');

function updatePass(pass, repass, email, callback) {
    // Kiểm tra dữ liệu
    if (!pass || !repass) {
        return callback('Vui lòng nhập đầy đủ thông tin', null);
    }

    // Kiểm tra độ dài mật khẩu
    if (pass.length <= 8) {
        return callback('Mật khẩu phải có ít nhất 8 ký tự', null);
    }

    // Kiểm tra mật khẩu có đủ chữ hoa, chữ thường, chữ số và kí tự đặc biệt
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(pass)) {
        return callback('Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt', null);
    }

    // Kiểm tra mật khẩu và nhập lại mật khẩu có khớp nhau không
    if (pass !== repass) {
        return callback('Mật khẩu nhập lại không khớp', null);
    }

    // Kiểm tra email có giá trị
    if (!email) {
        return callback('Không tìm thấy địa chỉ email', null);
    }

    const hashed_pass = bcrypt.hashSync(pass, 10);

    const sql = "UPDATE user SET Password = ? WHERE Email = ?";
    pool.query(sql, [hashed_pass, email], (err, result) => {
        if (err) {
            return callback('Đã xảy ra lỗi khi cập nhật mật khẩu', null);
        } else {
            return callback(null, 'Cập nhật mật khẩu thành công.');
        }
    });
}

module.exports = updatePass;
