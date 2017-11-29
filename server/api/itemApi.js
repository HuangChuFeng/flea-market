var express = require('express');

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

//发布商品
router.post('/publish', multipartMiddleware, async (req, res)=> {
    let params = req.body;
    var token = params.token;
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
		    var userUrl = '../static/public/uploads/items/user' + userId;
		    if (!fs.existsSync(userUrl)) {
		        fs.mkdirSync(userUrl);
		    }
		    userUrl += '/' + params.title;
		    if (!fs.existsSync(userUrl)) {
		        fs.mkdirSync(userUrl);
		    }
		    var imgPath = [];
		    for(var img in req.files) {
			    var type = req.files[img].type;    //获取上传文件格式
			    var size = req.files[img].size;    //获取上传文件大小
			    // config.myConsole('文件类型'+type)
			    // config.myConsole('文件大小'+size)
		        var oldPath = req.files[img].path;
		        var types = req.files[img].name.split('.');
		        var newPath = userUrl+'/'+img+"."+String(types[types.length-1]);
		        fs.renameSync(oldPath,newPath); 
		        imgPath.push(newPath);
		    }
		    imgPath = imgPath.join('&');
		    if(params.itemId) {   //更新商品信息
		    	var sql = "update items set title = ?, type = ?, price = ?, imgPath = ?, description = ?, level = ? where id = ? and sellerId = ?";
				conn.query(sql, [params.title, params.type, params.price, imgPath, params.description, params.level, params.itemId, userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
						res.json('数据库更新失败');
					}
					if (result) {
						console.log(result)
						res.json({'msg': '200'});
					}
				})
		    } else {              //增加商品条目
			    var sql = "insert into items(title, type, price, imgPath, description, level, sellerId) values (?, ?, ?, ?, ?, ?, ?)";
				conn.query(sql, [params.title, params.type, params.price, imgPath, params.description, params.level, userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
						res.json('数据库更新失败');
					}
					if (result) {
						console.log(result)
						res.json({'msg': '200'});
					}
				})
		    }
		}
	}
})

//获取全部商品
router.get('/getItems', (req, res) => {
	var params = req.query, sql;
	var token = req.headers['token'];
	if(params.getAll) {      //获取全部商品
		sql = "select id, title, imgPath, level, price from items";
		conn.query(sql, [], function(err, result) {
			if (err) {
				console.log("错误："+err);
			}
			if (result) {
				var myres = {};
				myres['items'] = result;  //result是一个数组
				if(token) {
					if(config.checkToken(token).isExpired) {  //token过期
						res.send('Access token has expired', 400)
					} else {
						token = config.checkToken(token).tokenData;
						var userId = token.iss;
						config.myConsole(userId)
						if(userId) {   //获取用户收藏商品
							sql = "select collect from user where id = ?";
							conn.query(sql, [userId], function(err, result) {
								if (err) {
									console.log("错误："+err);
								}
								if (result) {
									if(result[0].collect != null){
										myres['collect'] = result[0].collect.split('&');
									} else {
										myres['collect'] = [];
									}
									res.json(myres);
								}
							})
						} else {
							res.json(myres);
						}
					}
				} else {
					res.json(myres);
				}
			}
		})
	} else {                 //获取某个用户发布的所有商品
		if(token) {
			if(config.checkToken(token).isExpired) {  //token过期
				res.send('Access token has expired', 400)
			} else {
				token = config.checkToken(token).tokenData;
				var userId = token.iss;
				if(params.getPublish) {
					sql = "select id, title, imgPath, level, price from items where sellerId = ?";
					conn.query(sql, [userId], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							console.log(result)
							res.json(result);
						}
					})
				} else {      //只按照id获取某个商品
				}
			}
		}
		if(params.itemId){
					config.myConsole(params.itemId)
					sql = "select title, type, description, items.imgPath, level, price, sellerId, user.userName from items, user where items.id = ? and items.sellerId = user.id";
					conn.query(sql, [params.itemId], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							console.log(result)
							res.json(result);
						}
					})
				}
	}
});

//编辑商品信息
router.get('/editItem', (req, res) => {
	var params = req.query, sql;
	console.log(params)
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			if(params.type == 0) {   // 0 表示删除
				sql = "delete from items where id = ? and sellerId = ?";
				conn.query(sql, [params.itemId, userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
					}
					if (result) {
						console.log('长度:'+result.length)
						console.log(result)
						res.json(result);
					}
				})
			} else {   // 1 表示修改
				sql = "select id, title, imgPath, level, price from items where sellerId = ?";
				conn.query(sql, [userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
					}
					if (result) {
						console.log('长度:'+result.length)
						console.log(result)
						res.json(result);
					}
				})
			}
		}
	}
});


//收藏功能
router.post('/collect', (req, res) => {
	var params = req.body;
	console.log(params);
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var collectArr = null;
			var sql = "select collect from user where id = ?";
			conn.query(sql, [userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					collectArr = result[0].collect;
					if(collectArr != null) {
						collectArr = collectArr.split('&')
					}else {
						collectArr = [];
					}
					sql = "update user set collect = ? where id = ?";
					if(params.type == 1) {     //添加收藏
						collectArr.push(params.itemId);
						config.myConsole(params.itemId)
					} else {                   //取消收藏
						var index = collectArr.indexOf(params.itemId);
						collectArr.splice(index, 1);
						config.myConsole(collectArr)
					}
					if(collectArr.length == 0){
						collectArr = null;
					} else {
						collectArr = collectArr.join('&');
						config.myConsole(collectArr)
					}
					conn.query(sql, [collectArr, userId], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							res.json(result)
						}
					})
				}
			});
		}
	}
});

//获取用户收藏的商品
router.get('/getCollect', (req, res) => {
	var params = req.query;
	console.log(params);
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var collectArr = null;
			var sql = "select collect from user where id = ?";
			conn.query(sql, [userId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					collectArr = result[0].collect;
					if(collectArr != null) {
						collectArr = collectArr.split('&')
					}else {
						collectArr = [];
					}
					var obj = {};
					obj['collectItem'] = [];
					if(collectArr.length != 0) {
						config.myConsole(collectArr)
						collectArr = collectArr.join(",");  
						config.myConsole(collectArr)
						
						var sql = "select id, title, imgPath, level, price from items where id in ("+collectArr+")";
						conn.query(sql, function(err, result) {
							if (err) {
								console.log("错误："+err);
							}
							if (result) {
								config.myConsole(result)
								obj['collectItem'] = result;
								res.json(obj)
							}
						});
					} else {
						console.log('该用户没有收藏商品')
					}
				}
			});
		}
	}
});
module.exports = router;