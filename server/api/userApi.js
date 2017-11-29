
var express = require('express');
const fs = require('fs');
const path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir:'../static/public/uploads/' });

var router = express.Router();

var config = require('../config');

var jwt = require('jwt-simple')
const secret = 'market'  //密钥

// 连接数据库
var models = require('../database');
var mysql = require('mysql');
var conn = mysql.createConnection(models.mysql);
conn.connect();

const bcrypt = require('bcryptjs')  //加密算法
const salt = bcrypt.genSaltSync(10)


// 用户注册
router.post('/register', (req, res) => {
	var params = req.body;
	console.log(params);
	// 密码加盐处理
    const encryptPwd = bcrypt.hashSync(params.pwd, salt)
    config.myConsole(encryptPwd)
	var sql = "insert into user(userName, pwd, email) values (?, ?, ?)"
	conn.query(sql, [params.username, encryptPwd, params.email], function(err, result) {
		if (err) {
			console.log("错误："+err);
			res.json('注册失败')
		}
		if (result) {
			res.end();
		}
	})
});

//验证邮箱是否已占用
router.get('/checkEmail', (req, res) => {
	var params = req.query, sql;
	console.log(params)
	sql = "select email from user";
	conn.query(sql, [], function(err, result) {
		if (err) {
			console.log("错误："+err);
		}
		if (result) {
			var emailArr = [];
			for (var i = 0; i < result.length; i++) {
				emailArr.push(result[i].email)
			}
			if(emailArr.indexOf(params.inputEmail) >= 0) {
					res.json({occupy: true})
			} else {
				res.json({occupy: false});
			}
		}
	})
});

// 用户登录
router.post('/login', (req, res) => {
	var sql = "select id, imgPath, userName, pwd from user where email = ?";
	var params = req.body;
	console.log(params)
	conn.query(sql, [params.email], function(err, result) {
		if (err) {
			res.json('登录失败')
		}
		if (result) {
			if(result.length == 0){
				res.json('邮箱不存在')
			}
			//密码对比
			if(bcrypt.compareSync(params.pwd, result[0].pwd)){
				//生成token
				var expires =  Date.now() + 7 * 24 * 3600 * 1000  //7天后过期
				var token = jwt.encode({
				  iss: result[0].id,   //issuer表示请求的实体
				  exp: expires
				}, secret);

				var userInfo = {};
				userInfo.userName = result[0].userName;
				userInfo.userId = result[0].id;
				userInfo.imgSrc = result[0].imgPath;
				userInfo.token = token;
				config.jsonWrite(res, userInfo);
			}else{
				config.jsonWrite(res, '密码错误')
			}
		}
	})
});

//修改个人信息
router.post('/modifyInfo',  multipartMiddleware, async (req, res)=> {
	var params = req.body;
	var token = params.token;
	console.log(token)
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			if(params.newPwd) {   //修改密码
		    	const newEncryptPwd = bcrypt.hashSync(params.newPwd, salt)
				var sql = "update user set pwd = ? where id = ?";
				conn.query(sql, [newEncryptPwd, userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
						res.json('修改密码失败')
					}
					if (result) {
						res.json({code: 200})
					}
				})
			}
			if(req.files){   //更换头像
				var userUrl = '../static/public/uploads/portrait';
			    if (!fs.existsSync(userUrl)) {
			        fs.mkdirSync(userUrl);
			    }
			    var oldPath = req.files['newImg'].path;
		        var types = req.files['newImg'].name.split('.');
		        var seconds = String(new Date().getSeconds());
		        var newPath = userUrl+'/user'+userId+"_"+seconds+"."+String(types[types.length-1]);
		        fs.renameSync(oldPath,newPath); 
		        if(userId) {   //更新头像路径
			    	var sql = "update user set imgPath = ? where id = ?";
					conn.query(sql, [newPath, userId], function(err, result) {
						if (err) {
							console.log("错误："+err);
							res.json('数据库更新失败');
						}
						if (result) {
							console.log(newPath)
							res.json({'imgSrc': newPath});
						}
					})
			    }
			}
		}
	}
});

//echarts图表初始化
router.get('/echartsInit', (req, res) => {
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "select buyItemId, sellItemId, collect, COUNT(items.id) AS publishedCount from user, items where user.id = ? and items.sellerId = ?";
			conn.query(sql, [userId, userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					var buyItems = result[0].buyItemId, 
						sellItems = result[0].sellItemId, 
						collectItems = result[0].collect,
						publishedCount = 0,
						option = [];
					if(buyItems != null) {
						buyItems = buyItems.split('&').length;
					} else {
						buyItems = 0;
					}
					if(sellItems != null) {
						sellItems = sellItems.split('&').length;
					} else {
						sellItems = 0;
					}
					if(collectItems != null) {
						collectItems = collectItems.split('&').length;
					} else {
						collectItems = 0;
					}
					publishedCount = result[0].publishedCount;
					option.push(publishedCount, collectItems, buyItems, sellItems);
					res.json(option)
				}
			})
		}
	}
});
module.exports = router;