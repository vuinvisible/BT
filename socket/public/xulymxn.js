const pool = require('./pool');

function authToken(authtoken, email, callback){

    const sql = "SELECT Token FROM reset_pass WHERE Email = ? ORDER BY Time_Request DESC LIMIT 1";
    pool.query(sql, [email], (error, result) => {
        if (error) {
            return callback('Đã xảy ra lỗi khi kiểm tra dữ liệu', null);
        }

        if (result.length === 0) {
            return callback('Email không tồn tại', null);
        } else {
            let token = result[0].Token;

            if(authtoken === token) {
                return callback(null, 'Mã xác nhận hợp lệ. Bạn có thể đặt lại mật khẩu.');
            } else {
                return callback('Mã xác nhận không hợp lệ. Vui lòng thử lại.', null);
            }
        }
    });
}

module.exports = authToken;