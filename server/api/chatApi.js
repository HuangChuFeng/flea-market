var express = require('express');
const app = express();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir:'../static/public/uploads/' });

var router = express.Router();

var config = require('../config');
const fs = require('fs');
const path = require('path');


// 连接数据库
var models = require('../database');
var mysql = require('mysql');
var conn = mysql.createConnection(models.mysql);
conn.connect();


// 获取用户联系人
router.get('/getContacts', (req, res) => {
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "select contactsName from contacts, user where user.id = ? and contacts.userName = user.userName";
			conn.query(sql, [userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					res.json(result);
				}
			});
		}
	}
});

module.exports = router;