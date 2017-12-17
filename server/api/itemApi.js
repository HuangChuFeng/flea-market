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


// 每隔一天轮询订单数据表，如果存在订单超过一天未付款，则删除该订单
setInterval(function() {
	checkNoPayOrder();
}, 24 * 3600 * 1000)

function checkNoPayOrder() {
	var sql = "select * from orders where status = ?";
	conn.query(sql, [0], function(err, result) {
		if (err) {
			console.log("错误："+err);
			res.json('数据库查询失败');
		}
		if (result) {
			for (let i = 0; i < result.length; i++) {
				if(Date.now() - result[i].time > 24 * 3600 * 1000) {
					console.log('订单'+result[i].id+'已超过一天未付款');
					var sql = "delete from orders where id = ?";
					conn.query(sql, [result[i].id], function(err, result) {
						if (err) {
							console.log("错误："+err);
							res.json('数据库删除失败');
						}
						if (result) {
							console.log('删除超时订单成功！')
						}
					});
				}
			}
		}
	});
}



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
			var oldItemUrl = userUrl + '/' + params.oldTitle;
		    if(params.title != params.oldTitle && fs.existsSync(oldItemUrl)) {   //商品名称改变
		    	var newItemUrl = userUrl + '/' + params.title;
		    	fs.renameSync(oldItemUrl, newItemUrl); 

		    } else {
		    	userUrl += '/' + params.title;
		    	if (!fs.existsSync(userUrl)) {
		    		fs.mkdirSync(userUrl);
		    	}
		    }
		    var imgPath = [];
		    for(var img in req.files) {
			    var type = req.files[img].type;    //获取上传文件格式
			    var size = req.files[img].size;    //获取上传文件大小
			    // config.myConsole('文件类型'+type)
			    // config.myConsole('文件大小'+size)
			    var oldPath = req.files[img].path;
			    var types = req.files[img].name.split('.');
			    var newPath = userUrl + '/' + img + Date.now() + "." + String(types[types.length - 1]);
			    fs.renameSync(oldPath,newPath); 
			    imgPath.push(newPath);
			}
			imgPath = imgPath.join('&');
		    if(params.itemId) {   //更新商品信息
		    	if(params.oldImg) {
		    		var oldImg = params.oldImg.split(',');
		    		if(imgPath.length == 0) {  //图片没有改变
		    			imgPath = oldImg.join('&');
		    			imgPath = imgPath.replace(new RegExp(params.oldTitle,'g'), params.title)
		    		} else {
		    			imgPath += ('&'+oldImg.join('&'));
		    		}
		    	}
		    	var sql = "update items set title = ?, type = ?, price = ?, imgPath = ?, description = ?, level = ? where id = ? and sellerId = ?";
		    	conn.query(sql, [params.title, params.type, params.price, imgPath, params.description, params.level, params.itemId, userId], function(err, result) {
		    		if (err) {
		    			console.log("错误："+err);
		    			res.json('数据库更新失败');
		    		}
		    		if (result) {
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
		    	});
		    }
		}
	}
})

//获取全部商品
router.get('/getItems', (req, res) => {
	var params = req.query, sql;
	var token = req.headers['token'];
	if(params.getAll) {      //获取全部商品
		sql = "select id, title, imgPath, level, price, type from items where status = ?";
		conn.query(sql, [1], function(err, result) {
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
					sql = "select id, title, imgPath, level, status, price from items where sellerId = ?";
					conn.query(sql, [userId], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							res.json(result);
						}
					})
				} else {      //只按照id获取某个商品
				}
			}
		}
		if(params.itemId){
			config.myConsole(params.itemId)
			sql = 'update items set hits = hits+1 where id = ?'
			conn.query(sql, [params.itemId], function(err, result) {
				if (err) {
					console.log("错误："+err);
				}
				if (result) {
					sql = "select title, type, description, items.imgPath, level, price, sellerId, hits, user.userName from\
					items, user where items.id = ? and items.sellerId = user.id";
					conn.query(sql, [params.itemId], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							res.json(result);
						}
					});
				}
			});
		}
	}
});

//编辑商品信息
router.get('/editItem', (req, res) => {
	var params = req.query, sql;
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var itemUrl = '../static/public/uploads/items/user' + userId + '/' + params.itemTitle;
			if(params.type == 0) {   // 0 表示删除
				sql = "delete from items where id = ? and sellerId = ?";
				conn.query(sql, [params.itemId, userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
					}
					if (result) {
						deleteFolder(itemUrl);      //删除商品文件夹
						res.json(result);
					}
				})
			} else {   // 1 表示修改,获取商品信息
				sql = "select id, title, imgPath, level, price from items where sellerId = ?";
				conn.query(sql, [userId], function(err, result) {
					if (err) {
						console.log("错误："+err);
					}
					if (result) {
						console.log('长度:'+result.length)
						res.json(result);
					}
				})
			}
		}
	}
});

//删除商品时删除存放图片的文件夹
function deleteFolder(path) {
	var files = [];
	if( fs.existsSync(path) ) {
		files = fs.readdirSync(path);
		files.forEach(function(file,index){
			var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
            	deleteFolder(curPath);
            } else { // delete file
            	fs.unlinkSync(curPath);
            }
        });
		fs.rmdirSync(path);
	}
}

//收藏功能
router.post('/collect', (req, res) => {
	var params = req.body;
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


//购买
router.post('/buy', (req, res) => {
	var params = req.body;
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "select itemId from orders where status != ?";
			conn.query(sql, [2], function(err, result) {
				if (err) {
					console.log("错误："+err);
					res.json('数据库查询失败');
				}
				if (result) {
					console.log(result);
					//查看未付款订单表中有没有该商品
					var flag = false;
					for (var i = 0; i < result.length; i++) {
						if(result[i].itemId == params.itemId) {
							flag = true;
							break;
						}
					}
					if(flag) {
						res.json({exist: flag})
					} else {
						var sql = "insert into orders (itemId, sellerId, buyerId) values (?, ?, ?)";
						conn.query(sql, [params.itemId, params.sellerId, userId], function(err, result) {
							if (err) {
								console.log("错误："+err);
								res.json('数据库更新失败');
							}
							if (result) {
								res.json({msg: 200});
							}
						});
					}
				}
			});
		}
	}
});

//付款
router.post('/pay', (req, res) => {
	var params = req.body;
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "update orders set status = ? where id = ?";
			conn.query(sql, [1, params.orderId], function(err, result) {
				if (err) {
					console.log("错误："+err);
					res.json('数据库更新失败');
				}
				if (result) {
					res.json({msg: 200});
				}
			});
		}
	}
});

//卖家确认到账
router.post('/intoAccount', (req, res) => {
	var params = req.body;
	var token = req.headers['token'];
	if(token) {
		if(config.checkToken(token).isExpired) {  //token过期
			res.send('Access token has expired', 400)
		} else {
			token = config.checkToken(token).tokenData;
			var userId = token.iss;
			var sql = "update orders, items set orders.status = ?, items.status = ? \
			where orders.id = ? and items.id = orders.itemId";
			conn.query(sql, [2, 0, params.orderId], function(err, result) {
				if (err) {
					console.log("错误："+err);
					res.json('数据库更新失败');
				}
				if (result) {
					res.json({msg: 200});
				}
			});
		}
	}
});


//获取搜索结果
router.get('/search', (req, res) => {
	var params = req.query;
	var sql = "select id, title, imgPath, level, price, type from items where title like\
	'%"+params.key+"%' or description like '%"+params.key+"%'";
	conn.query(sql, [], function(err, result) {
		if (err) {
			console.log("错误："+err);
			res.json('数据库更新失败');
		}
		if (result) {
			res.json({items: result});
		}
	});
});
module.exports = router;