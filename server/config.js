// var models = require('../database');
// var express = require('express');
// var mysql = require('mysql');
// // var $sql = require('../sqlMap');
// // var bodyParser = require('body-parser')
// // var multiparty = require('multiparty');  

// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart({uploadDir:'../static/public/uploads/' });

// var router = express.Router();
// // var http = require('http');
// // var util = require('util');
  
// var config = require('../config');

// // var formidable = require('formidable');//上传功能的插件
// // var path = require('path');
// // var fs = require('fs');

// // 连接数据库
// var conn = mysql.createConnection(models.mysql);
// conn.connect();

// // router.use(bodyParser.json())  
// // router.use(bodyParser.json({limit: '50mb'}));
// // router.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
var jwt = require('jwt-simple')
const secret = 'market' //密钥

var config = {
	jsonWrite: function(res, ret) {
		if(typeof ret === 'undefined') {
			res.json({
				code: '1',
				msg: '操作失败'
			});
		} else {
			res.json(ret);
		}
	},
	myConsole: function(msg) {
	   console.log('================================================================')
	   console.log('')
	   console.log(msg)
	   console.log('')
	   console.log('================================================================')
	   console.log('')
	},
	checkToken: function(token) {
		try {
		    var decoded = jwt.decode(token, secret), isExpired = false;  //false未过期
		    if (decoded.exp <= Date.now()) {              //如果token过期
		    	isExpired = true;
			    return {'isExpired': isExpired};  //服务端没有数据返回时可用res.end
			} else {   //未过期, 返回解码数据
				return {'tokenData':decoded};
			}
		} catch (err) {
	   		return err;
	    }
	}
}
module.exports = config;