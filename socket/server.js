const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const pool = require('./public/pool');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'keyboard cat', //Một chuỗi hoặc một mảng byte để ký hoặc mã hóa cookie.
  
  //Xác định liệu session có được lưu lại mỗi khi có thay đổi không
  resave: false, // false để tránh lưu lại session nếu không có thay đổi.
  
  // Xác định liệu session sẽ được lưu nếu chưa được khởi tạo
  saveUninitialized: false, //false để tránh lưu lại session nếu chưa được khởi tạo.
  
  //Đối tượng chứa các cài đặt cho cookie session
  cookie: {
    maxAge: 60000 //maxAge để xác định thời gian sống của cookie (đơn vị tính là mili giây).
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Thiết lập định dạng xử lý dữ liệu từ form POST
app.use(bodyParser.urlencoded({ extended: true }));

// Thiết lập thư mục chứa các tệp tĩnh như CSS, JavaScript, v.v.
app.use(express.static(path.join(__dirname, 'public')));

// Route cho trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'trangchu.html'));
});

// Route cho trang đăng ký
app.get('/dangky.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dangky.html'));
});

const {registerUser} = require('./public/xulydangky')
// Route xử lý đăng ký từ biểu mẫu
app.post('/register', (req, res) => {
  const { username, password, repass, email } = req.body;

  registerUser(username, password, repass, email, (error, result) => {
    if (error) {
      // Xử lý lỗi và chuyển hướng
      return res.send(`<script>alert("${error}"); window.location.href="dangky.html";</script>`);
    } else {
        // Đăng ký thành công, chuyển hướng tới trang khác hoặc thực hiện hành động khác
        return res.redirect('dangnhap.html');
    }
  });

  // function handleErrorAndRedirect(message, redirectUrl) {
  //   const errorMessage = `<script>alert("${message}"); window.location.href="${redirectUrl}";</script>`;
  //   res.send(errorMessage);
  // }

  // // Kiểm tra dữ liệu từ biểu mẫu
  // if (!username || !password || !repass || !email) {
  //     return handleErrorAndRedirect('Vui lòng nhập đầy đủ thông tin', 'dangky.html');
  // }

  // // Kiểm tra mật khẩu có đủ độ dài không
  // if (password.length <= 8) {
  //     return handleErrorAndRedirect('Mật khẩu phải có ít nhất 8 ký tự', 'dangky.html');
  // }

  // // Kiểm tra mật khẩu có đủ độ mạnh không
  // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(password)) {
  //     return handleErrorAndRedirect('Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt', 'dangky.html');
  // }

  // // Kiểm tra mật khẩu nhập lại có khớp không
  // if (password !== repass) {
  //     return handleErrorAndRedirect('Mật khẩu nhập lại không khớp', 'dangky.html');
  // }

  // // Kiểm tra định dạng email
  // if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
  //     return handleErrorAndRedirect('Email không đúng định dạng', 'dangky.html');
  // }

  // // Kiểm tra xem email đã tồn tại hay chưa
  // pool.query('SELECT Email FROM user WHERE Email = ?', email, (error, results) => {
  //     if (error) {
  //         return handleErrorAndRedirect('Đã xảy ra lỗi khi kiểm tra dữ liệu', 'dangky.html');
  //     }

  //     if (results.length > 0) {
  //         return handleErrorAndRedirect('Email đã được sử dụng', 'dangky.html');
  //     }

  //     // Mã hóa mật khẩu
  //     const hashed_pass = bcrypt.hashSync(password, 10);

  //     // Thêm dữ liệu vào bảng taikhoan trong cơ sở dữ liệu
  //     const sql = `INSERT INTO user (Username, Password, Email) VALUES (?, ?, ?)`;
  //     pool.query(sql, [username, hashed_pass, email], (err, result) => {
  //         if (err) {
  //             return handleErrorAndRedirect('Đã xảy ra lỗi khi đăng ký tài khoản', 'dangky.html');
  //         }
  //         res.redirect('dangnhap.html');
  //     });
  //   });
});

app.get('/dangnhap.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dangnhap.html'));
});

const { loginUser } = require('./public/xulydangnhap');
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  loginUser(username, password, (error, result) => {
    if (error) {
      // Xử lý lỗi và chuyển hướng
      return res.send(`<script>alert("${error}"); window.location.href="dangnhap.html";</script>`);
    } else {
        // Đăng nhập thành công, chuyển hướng tới trang khác hoặc thực hiện hành động khác
        req.session.user = result;
        return res.redirect('/index.ejs');
    }
  });

  // function handleErrorAndRedirect(message, redirectUrl) {
  //   const errorMessage = `<script>alert("${message}"); window.location.href="${redirectUrl}";</script>`;
  //   res.send(errorMessage);
  // }

  // // Kiểm tra dữ liệu từ biểu mẫu
  // if (!username || !password) {
  //     return handleErrorAndRedirect('Vui lòng nhập đầy đủ thông tin', 'dangnhap.html');
  // }

  // // Kiểm tra mật khẩu có đủ độ dài không
  // if (password.length <= 8) {
  //     return handleErrorAndRedirect('Mật khẩu phải có ít nhất 8 ký tự', 'dangnhap.html');
  // }

  // pool.query('SELECT Password FROM user WHERE Username = ?', [username], (error, results) => {
  //   if (error) {
  //       console.error('Error while fetching user:', error);
  //       return handleErrorAndRedirect('Đã xảy ra lỗi khi đăng nhập', '/dangnhap.html');
  //   }

  //   if (results.length === 0) {
  //     return handleErrorAndRedirect('Tài khoản không tồn tại', '/dangnhap.html');
  //   }

  //   const hashed_mk = results[0].Password;

  //   bcrypt.compare(password, hashed_mk, (err, result) => {
  //       if (err) {
  //           console.error('Error while comparing passwords:', err);
  //           return handleErrorAndRedirect('Đã xảy ra lỗi khi đăng nhập', '/dangnhap.html');
  //       }

  //       if (result) {
  //           // Correct password
  //           req.session.user = username;
  //           return res.redirect('/index.html');
  //       } else {
  //           // Incorrect password
  //           return handleErrorAndRedirect('Tài khoản hoặc mật khẩu không đúng', '/dangnhap.html');
  //       }
  //   });
  // });
});

app.get('/index.ejs', function (req, res) {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.render('index', {session: req.session});
});

// app.get('/api/session', (req, res) => {
//   res.json({ user: req.session.user });
// });

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

var username;
io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('joining msg', (name) => {
    username = name; // Gán giá trị của biến name từ sự kiện 'joining msg' cho biến username
    io.emit('chat message', { sender: 'System', message: `---${username} joined the chat---` });
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', { sender: 'System', message: `---${username} left the chat---` });
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', { sender: data.sender, message: data.message });
  });

});

const port = 8017;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
