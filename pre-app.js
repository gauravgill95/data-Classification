var express =require('express');
// Enter your password here.
var password='1234567890';
//Enter host name here
var host='localhost';
//Enter username here 
var user= 'root';

var mysql = require('mysql');
var con = mysql.createConnection({
  host: host,
  user: user,
  password: password,
});
con.query("CREATE DATABASE if not exists db1", function (err, result) {
    if (err) throw err;
    console.log("Database created");
});

con.end();