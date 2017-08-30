var express = require('express');
var router = express.Router();

//   01. MySQL 로드
//   패키지에서 mysql를 꼭 깔아야 한다.require('페키지명')
var mysql = require('mysql');
var pool = mysql.createPool
({
    connectionLimit: 3,
    host: '127.0.0.1',  //xampp 일경우에는 알다시피 이런 아이피 주소로
    user: 'nodejs',
    database: 'nodejs',
    password: 'nodejs'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});

// 리스트 전체 보기 GET
// 02. get/posnt(/list/:(/파라미터) req=reuqest , res=response
router.get('/list/:page', function(req,res,next){

    //03. mysql 을 연결한다.
    pool.getConnection(function (err, connection)
    {
        //04. SQL 질의를 한다.
        var sqlForSelectList = "SELECT idx, creator_id, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate,hit FROM board";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error("err : " + err);
            // console.log("rows : " + JSON.stringify(rows));
            //05. list라는 view에 랜더링 한다. view.ejs, EL태그를 보낸다. 그리고 rows=이것은 데이터에 행
            res.render('list', {title: ' 게시판 전체 글 조회', rows: rows});
            connection.release();

        });
    });
});

// 글쓰기 화면 표시 GET
router.get('/write', function(req,res,next){
    res.render('write',{title : "게시판 글 쓰기",style: req.param.style});
});

// 06. 파라미터에 따라서 원하는 내용을 :(변수)를 받아서 사용한다.
router.get('/write/:style/:uploadYN', function(req,res,next){
    res.render('write',{title : "텍스트 편집기 게시판 글 쓰기",style: req.params.style,uploadYN: req.params.uploadYN});

});


// 글쓰기 로직 처리 POST
router.post('/write', function(req,res,next){

    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    // 07. 데이터를 배열로 저장한다.
    var datas = [creator_id,title,content,passwd];

    pool.getConnection(function (err, connection)
    {
        var sqlForInsertBoard = "insert into board(creator_id, title, content, passwd) values(?,?,?,?)";
        //08. 배열 데이터를 그대로 입력한다. 순서대로 ??? 물음표에 들어간다.
        connection.query(sqlForInsertBoard,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            // console.log("rows : " + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();

        });
    });

});
//글 조회 로직 처리
router.get('/read/:idx',function(req,res,next)
{
    var idx = req.params.idx;

    pool.getConnection(function(err,connection)
    {
        var sql = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, hit from board where idx=?";
        connection.query(sql,[idx], function(err,row)
        {
            if(err) console.error(err);
            // console.log("1개 글 조회 결과 확인 : ",row);
            res.render('read', {title:"글 조회", row:row[0]});
            connection.release();
        });
    });
});

router.get('/update',function(req,res,next)
{
    var idx = req.query.idx;

    pool.getConnection(function(err,connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, hit from board where idx=?";
        connection.query(sql, [idx], function(err,rows)
        {
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ",rows);
            res.render('update', {title:"글 수정", row:rows[0]});
            connection.release();
        });
    });

});


router.post('/update',function(req,res,next)
{
    var idx = req.body.idx;
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [creator_id,title,content,idx,passwd];

    pool.getConnection(function(err,connection)
    {
        var sql = "update board set creator_id=? , title=?,content=?, regdate=now() where idx=? and passwd=?";
        connection.query(sql,datas,function(err,result)
        {
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
                res.redirect('/board/read/'+idx);
            }
            connection.release();
        });
    });
});

module.exports = router;
