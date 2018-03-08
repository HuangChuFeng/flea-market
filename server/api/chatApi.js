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
			res.send(400, { tokenError: 'Access token has expired'});
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "select contacts.userName, contactsName, user.userName as name from contacts, user \
			where user.id = ? and isDel = ?";
			conn.query(sql, [userId, 0], function(err, result) {
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
			res.send(400, { tokenError: 'Access token has expired'});
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			//获取用户和当前聊天对象的聊天记录(用户发出的和收到的)
			var sql = "select message.id, fromName, toName, content, createdTime, type, status, delName from message, user, contacts where\
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
			res.send(400, { tokenError: 'Access token has expired'});
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
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send(400, { tokenError: 'Access token has expired'});
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

// 删除消息
router.post('/delMsg', (req, res) => {
	var params = req.body, sql1, sql2;
	console.log(params)
	// 如果对方已经删除则删除该记录，否则更新
	sql1 = `update message set delName = ? where delName is null and id = ?`;
	sql2 = `delete from message where delName is not null and id = ?`;
	conn.query(sql2, [params.id], function(err, result) {
		if (err) {
			console.log("错误："+err);
		}
		if (result) {
			sqlAsync();
		}
	})
	function sqlAsync() {
		conn.query(sql1, [params.delName, params.id], function(err, result) {
			if (err) {
				console.log("错误："+err);
			}
			if (result) {
				console.log(result)
				res.json(result);
			}
		})
	}
});

// 删除联系人，即清空聊天记录，其中删除消息时全为发送方删除
router.post('/delContact', (req, res) => {
	var params = req.body, sql1, sql2, sql3;
	// 删除消息记录
	sql1 = `update message set delName = ? where delName is null and 
	((fromName = ? and toName = ?) or (fromName = ? and toName = ?))`;
	sql2 = `delete from message where delName is not null and ((fromName = ? and toName = ?) or (fromName = ? and toName = ?))`;
	sql3 = 'update contacts set isDel = ? where ((userName = ? and contactsName = ?) or (userName = ? and contactsName = ?))'
	conn.query(sql2, [params.userName, params.contactsName, params.contactsName, params.userName], function(err, result) {
		if (err) {
			console.log("错误1："+err);
		}
		if (result) {
			sqlAsync1();
		}
	});
	function sqlAsync1() {
		conn.query(sql1, [params.userName, params.userName, params.contactsName, params.contactsName, params.userName], function(err, result) {
			if (err) {
				console.log("错误："+err);
			}
			if (result) {
				sqlAsync2();
			}
		})
	}
	// 删除联系人关系
	function sqlAsync2() {
		conn.query(sql3, [1, params.userName, params.contactsName, params.contactsName, params.userName], function(err, result) {
			if (err) {
				console.log("错误："+err);
			}
			if (result) {
				res.json(result);
			}
		})
	}
});
module.exports = router;