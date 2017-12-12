var express = require('express');
const app = express();

var router = express.Router();

var config = require('../config');
const fs = require('fs');
const path = require('path');


var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir:'../static/public/chatRecord/' });
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
			var sql = "select contacts.userName, contactsName, user.userName as name from contacts, user where user.id = ?";
			conn.query(sql, [userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					var contactsArr = []
					for (var i = 0; i < result.length; i++) {
						if(result[i].name == result[i].contactsName) {
							contactsArr.push({ contactsName: result[i].userName })
						}
						if(result[i].name == result[i].userName) {
							contactsArr.push({ contactsName: result[i].contactsName })
						}
					}
					res.json(contactsArr);
				}
			});
		}
	}
});

//获取与某个联系人的聊天记录
router.get('/getChatRecord', (req, res) => {
	var params = req.query;
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			//获取用户和当前聊天对象的聊天记录(用户发出的和收到的)
			var sql = "select fromName, toName, content, createdTime, type, status from message, user, contacts where\
			 user.id = ? and ((contacts.userName = user.userName and contacts.contactsName = ?)\
			 or (contacts.userName = ? and contacts.contactsName = user.userName)) and\
			  contacts.id = message.belong";
			conn.query(sql, [userId, params.contactsName, params.contactsName], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					res.json(result)
				}
			});
		}
	}
});

//获取未读消息, 返回来自哪个联系人的几条未读消息
router.get('/getUnreadMsg', (req, res) => {
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			//获取用户和当前聊天对象的聊天记录(用户发出的和收到的)
			var sql = "select fromName, COUNT(fromName) from message, user where user.id = ? and\
			 message.toName = user.userName and status = ? GROUP BY(fromName)";
			conn.query(sql, [userId, 0], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					console.log(result)
					res.json(result)
				}
			});
		}
	}
});

//把消息置为已读
router.post('/setRead', (req, res) => {
	var params = req.body;
	console.log(params)
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "update message set status = ? where fromName = ? and \
			toName = (select userName from user where id = ?)";
			conn.query(sql, [1, params.fromName, userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					res.json(result)
				}
			});
		}
	}
});

//发送图片
router.post('/sendMsg', multipartMiddleware, async (req, res)=> {
    let params = req.body;
    var token = params.token;
    var oldPath = req.files['imgMsg'].path;
    var types = req.files['imgMsg'].name.split('.');
    var newPath = '../static/public/chatRecord/' + Date.now() + "." + String(types[types.length - 1]);
    if (fs.existsSync(newPath)) {
        newPath = '../static/public/chatRecord/' + Date.now() + "." + String(types[types.length - 1]);
    }
    fs.renameSync(oldPath,newPath); 
   	res.json({msgPath: newPath});
})
module.exports = router;