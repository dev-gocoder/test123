// 인덱스 페이지다. board.js 분석하면 됨

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: '127.0.0.1',
    user: 'nodejs',
    database: 'test',
    password: 'nodejs'
});


/* GET home page. */
router.get('/', function (req, res, next) {

    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('SELECT * FROM board', function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('index', {title: 'test', rows: rows});
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});





module.exports = router;
