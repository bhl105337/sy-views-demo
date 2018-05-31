var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var config = {
    host:'182.61.26.179',
    port:3306,
    // database:'sywltest',
    database:'oneyouxi',
    user:'root',
    password:'990205'
};

//创建连接池
var pool = mysql.createPool(config);

/**
 * 数据库查询操作封装
 * @param sql 执行的sql语句
 * @param params sql语句中的参数
 * @param callback  回调函数
 */
var query = function (sql,params,callback) {

    //从连接池中获取一个连接
    pool.getConnection(function (err,connection) {

        if(err) return console.log('创建数据库连接失败,',err);

        //执行sql语句
        connection.query(sql,params,function (err,result) {
            if(err) return console.log('数据库查询失败,',err);
            //释放连接对象
            connection.release();
            //调用回调函数,传入查询结果
            callback(result);

        })
    });
};

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index');
});
router.get('/', function(req, res, next) {
    res.render('login');
});
router.post('/',function (req,res,next) {
    var mysql="select *from t_admin where name=? and password=?";
    query(mysql,[req.body.name,req.body.password],function (result) {
        result.length>0?res.json({state:1,user:result}):res.json({state:0,user:result});
    })
});
router.get('/download', function(req, res, next) {
    res.render('download/download'+req.query.data);
});
module.exports = router;
