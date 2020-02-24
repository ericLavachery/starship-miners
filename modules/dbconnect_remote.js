// connect to mysql
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "wzW5xdQemU",
    password: "bWVrHFaYhq",
    database: "wzW5xdQemU"
});
module.exports.con = con;
