//01. 이곳에 필요한 기능들을 레디 시켜놓는다.
var express = require('express'); //노드js 익스프레스 툴을 준비한다. 중요
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//02. 라우터 설정부분 컨트롤러 역할을 한다. 해당 변수가 접근 URL이 접근할수 있는 파일 위치
var routes = require('./routes/index');
var users = require('./routes/users');
var board = require('./routes/board');

//03. 익스프레스 가동
var app = express();

// view engine setup
//04. 뷰 연동
app.set('views', path.join(__dirname, 'views'));
//05. 뷰에 어떤 프로엠워크로 할지 Ejs가 친숙한 EL 방식이다.
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//06. 잘은 모르지만 express 에서 기본 제공하는 환경
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//07. URL 맵핑이다. 해당 URL 주소로 라우터를 찾아간다. 02참조
// app.use('/', routes);  //인덱스로 보내는거 나중에 헷갈릴수 있으니 인덱스도 그냥 보드로 
app.use('/', board);
app.use('/users', users);
app.use('/board', board);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
