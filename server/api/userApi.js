
var express = require('express');
const app = express();
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
var nodemailer  = require('nodemailer');	


// 用户注册
router.post('/register', (req, res) => {
	var params = req.body;
	// 密码加盐处理
	const encryptPwd = bcrypt.hashSync(params.pwd, salt)
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
			if(emailArr.indexOf(params.inputEmail) >= 0) { //邮箱存在
				res.json({occupy: true})
			} else {  //不存在
				res.json({occupy: false});
			}
		}
	})
});

// 用户登录
router.post('/login', (req, res) => {
	var sql = "select id, imgPath, userName, pwd from user where email = ?";
	var params = req.body;
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
				res.json(userInfo);
			}else{
				res.json({pwdIsWrong: true})
			}
		}
	})
});


//修改个人信息
router.post('/modifyInfo',  multipartMiddleware, async (req, res)=> {
	var params = req.body;
	var token = params.token;
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
				var userUrl = '../static/static/public/uploads/portrait';
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
			var sql = "select collect, COUNT(items.id) AS publishedCount from user, items where user.id = ? and items.sellerId = user.id";
			conn.query(sql, [userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					var collectCount = result[0].collect,
					publishedCount = result[0].publishedCount;
					option = [];
					if(collectCount != null) {
						collectCount = collectCount.split('&').length;
					} else {
						collectCount = 0;
					}
					option.push(publishedCount, collectCount);
					var sql = "select COUNT(orders.id) as buyCount from orders where buyerId = ?";
					conn.query(sql, [userId], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							buyCount = result[0].buyCount
							option.push(buyCount);
							var sql = "select COUNT(items.id) AS saleCount from items where items.sellerId = ? and items.status = ?";
							conn.query(sql, [userId, 0], function(err, result) {
								if (err) {
									console.log("错误："+err);
								}
								if (result) {
									var saleCount = result[0].saleCount;
									option.push(saleCount);
									res.json(option);
								}
							})
						}
					})
				}
			})
		}
	}
});


//通过发送邮件的方式修改密码
// 创建一个SMTP客户端配置
var Emailconfig = {
	host: 'smtp.qq.com', 
	port: 25,
        // secure: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth: {
            user: '1378894282@qq.com', //刚才注册的邮箱账号
            pass: 'vqgxawirceguhgai'  //邮箱的授权码，不是注册时的密码
        }
    };

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(Emailconfig);

// 发送邮件
router.post('/sendEamil', (req, res) => {
	var params = req.body, resetPwd;
	resetPwd = Math.random().toString(36).substr(2);
	var options = {
		from: '1378894282@qq.com',
		to: params.email,
		subject: '重置密码',
		text: '一封来自Market网站的邮件',
		html: '<p>'+params.email+'您好, 系统已为你修改了账户密码如下:<h1>'
		+resetPwd+'</h1><p>请尽快登录并修改密码</p>',
	}; 
	transporter.sendMail(options, function(err, msg){
		if(err){
			console.log(err);
		}
		else {
			const newEncryptPwd = bcrypt.hashSync(resetPwd, salt)
			var sql = "update user set pwd = ? where email = ?";
			conn.query(sql, [newEncryptPwd, params.email], function(err, result) {
				if (err) {
					console.log("错误："+err);
					res.json('修改密码失败')
				}
				if (result) {
					res.json({msg: '重置密码成功'})
				}
			})
		}
	});
});


//获取用户订单
router.get('/getOrders', (req, res) => {
	var token = req.headers['token'];
	var params = req.query;
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			if(params.type == 'in') {  //买入
				var sql = "select orders.id, user.userName as sellerName, orders.sellerId, title, price, orders.status, items.imgPath, time from items, orders, user where\
				user.id = orders.sellerId and orders.itemId = items.id and buyerId = ?";
				conn.query(sql, [userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
					}
					if (result) {
						res.json(result)
					}
				})
			}
			if(params.type == 'out') {  //卖出
				var sql = "select orders.id, user.userName as buyerName, orders.buyerId, title, price, orders.status, items.imgPath, time from items, orders, user where\
				user.id = orders.buyerId and orders.itemId = items.id and orders.sellerId = ?";
				conn.query(sql, [userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
					}
					if (result) {
						res.json(result)
					}
				})
			}
			
		}
	}
});

//填写支付帐号
router.post('/insertAccount', (req, res) => {
	var token = req.headers['token'], params = req.body;
	var account = params.account;
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "update user set account = ? where id = ?";
			conn.query(sql, [account, userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					res.json({msg: 200})
				}
			})
		}
	}
});

//获取支付帐号
router.get('/getAccount', (req, res) => {
	var token = req.headers['token'], params = req.query;
	var orderId = params.orderId;
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			var sql = "select account, userName from user where user.id = (select sellerId from orders where id = ?)";
			conn.query(sql, [orderId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					res.json(result)
				}
			})
		}
	}
});
module.exports = router;