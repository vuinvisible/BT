var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');

const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat', // Chuỗi bí mật để ký hoặc mã hóa cookie
  resave: false, // Không lưu lại session nếu không có thay đổi
  saveUninitialized: true, // Lưu session nếu chưa được khởi tạo
  cookie: {
    maxAge: 3 * 60 * 1000 // 3 phút (3 phút * 60 giây * 1000 mili giây)
  }
}));


// Thiết lập định dạng xử lý dữ liệu từ form POST
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname, 'public', 'trangchu.html');
});

// Route cho trang đăng ký
app.get('/dangky.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dangky.html'));
});

const registerUser = require('./public/xulydangky')
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
});

app.get('/dangnhap.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dangnhap.html'));
});

const loginUser = require('./public/xulydangnhap');
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  loginUser(username, password, (error, result) => {
    if (error) {
      // Xử lý lỗi và chuyển hướng
      return res.send(`<script>alert("${error}"); window.location.href="dangnhap.html";</script>`);
    } else {
        // Đăng nhập thành công, chuyển hướng tới trang khác hoặc thực hiện hành động khác
        req.session.user = result;
        return res.redirect('index.html');
    }
  });
});

app.get('/index.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/forgotpassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quenmatkhau.html'));
});

const forgotPass = require('./public/xulyqmk');
app.post('/xulyqmk', (req, res) => {
  const { email } = req.body;

  forgotPass(email, (error, result) => {
    if (error) {
      // Xử lý lỗi và chuyển hướng
      return res.send(`<script>alert("${error}"); window.location.href="quenmatkhau.html";</script>`);
    } else {
        req.session.email = result;
        // Đăng ký thành công, chuyển hướng tới trang xác nhận mật khẩu
        return res.redirect('maxacnhan.html');
    }
  });
});

app.get('/api/session', (req, res) => {
  const sessionData = {}; // Đối tượng để chứa thông tin trong session

  // Lặp qua tất cả các thuộc tính của session và đưa chúng vào đối tượng sessionData
  for (const key in req.session) {
    if (Object.hasOwnProperty.call(req.session, key)) {
      sessionData[key] = req.session[key];
    }
  }

  if (Object.keys(sessionData).length > 0) {
    res.json(sessionData); // Trả về tất cả thông tin trong session
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});



app.get('/maxacnhan.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','maxacnhan.html'));
});

const authToken = require('./public/xulymxn');
app.post('/xulymxn', (req, res) => {
  const { authtoken } = req.body;
  const email = req.session.email;

  authToken(authtoken, email, (error, result) => {
    if (error) {
      // Xử lý lỗi và chuyển hướng
      return res.send(`<script>alert("${error}"); window.location.href="maxacnhan.html";</script>`);
    } else {
      return res.redirect('matkhaumoi.html');
    }
  });
});

app.get('/matkhaumoi.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','matkhaumoi.html'));
});

const updatePass = require('./public/xulymkm');
app.post('/xulymkm', (req, res) => {
  const { pass, repass } = req.body;
  const email = req.session.email;

  updatePass(pass, repass, email, (err, result) => {
    if (err) {
      // Xử lý lỗi và chuyển hướng
      return res.send(`<script>alert("${err}"); window.location.href="matkhaumoi.html";</script>`);
    } else {
        // Cập nhật thành công, chuyển hướng tới trang đăng nhập
        return res.redirect('dangnhap.html');
    }
  });
});

// Khởi tạo một đối tượng để lưu trữ thông tin người dùng kết nối
var connectedUsers = {};

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('joining msg', (name) => {
    // Lưu tên người dùng kết nối với id của socket tương ứng
    connectedUsers[socket.id] = name;

    // Gửi tin nhắn thông báo việc người dùng mới đã tham gia
    io.emit('chat message', { sender: 'System', message: `---${name} joined the chat---` });
  });
  
  socket.on('disconnect', () => {
    // Lấy tên người dùng từ đối tượng connectedUsers
    const username = connectedUsers[socket.id];

    // Kiểm tra xem người dùng có tồn tại không trước khi gửi thông báo
    if (username) {
      console.log('user disconnected');
      // Gửi tin nhắn thông báo việc người dùng đã rời khỏi chat
      io.emit('chat message', { sender: 'System', message: `---${username} left the chat---` });

      // Xóa thông tin của người dùng khỏi đối tượng connectedUsers
      delete connectedUsers[socket.id];
    }
  });

  socket.on('chat message', (data) => {
    // Truyền tin nhắn từ người dùng này đến tất cả người dùng khác
    io.emit('chat message', { sender: data.sender, message: data.message });
  });
});

server.listen(8017, () => {
  console.log('Server listening on :8017');
});

module.exports = app;