// node 后端服务器
const userApi = require('./api/userApi');
const itemApi = require('./api/itemApi');
const chatApi = require('./api/chatApi');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const util = require('util');

// const http = require('http');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// //设置session
// app.use(cookieParser())
// app.use(session({
// 	secret: 'market',
// 	userInfo: {},
// 	cookie: {maxAge: 60000},
// 	resave: false,
// 	saveUninitialized: true
// }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 后端api路由
app.use('/api/user', userApi);
app.use('/api/item', itemApi);
app.use('/api/chat', chatApi);


// 连接数据库
var models = require('./database');
var mysql = require('mysql');
var conn = mysql.createConnection(models.mysql);
conn.connect();


/*******************聊天室开始*********************/
// app.get('/',function(req,res){
//     res.sendFile(__dirname+'/api/index.html');
// })
/*在connection事件的回调函数中，socket表示当前连接到服务器的那个客户端，
所以socket.emit('foo')只有自己收到这个事件，而socket.broadcast.emit('foo')
则表示向除了自己外的所有人发送该事件*/
var users = {};

io.on('connection', function (socket) {
	var isFirstSend = true; //是否是第一次向当前卖家发送消息, 默认为第一次
	console.log('---------------------socket连接成功-------------------------');

	socket.on('disconnect', function(){
		for(key in users) {
			if(users[key] == socket) {
				console.log(key+'离线了')
				delete users[key];
				break;
			}
		}
	});
    //建立聊天关系
    socket.on('comming in', function(data) {
    	if(data.username in users) {

    	} else {
    		var userName = data.userName;
    		users[userName] = socket; 
    		socket.emit('in', { text: '可以开始聊天' }); //发出事件
    		console.log(userName+'上线了');
    	}
    });

    socket.on('private message', function (from,to,msg) {
    	console.log('系统已接受消息：', from, ' 对 ',to, '说：',msg);
    	/* 发送消息时，如果当前卖家是用户的历史练习人，则不是第一次发送  */
    	var sql = "select id as relationId, userName, contactsName from contacts";
    	var relationId;
    	conn.query(sql, [], function(err, result) {
    		if (err) {
    			console.log("错误："+err);
    		}
    		if (result) {
    			for (var i = 0; i < result.length; i++) {
					//存在该联系人
					if((result[i].userName == from && result[i].contactsName == to) ||
						(result[i].userName == to && result[i].contactsName == from)) {
							isFirstSend = false;    //不是第一次发送
						relationId = result[i].relationId;
						break;
					}
				}
				console.log('是否是第一次发送:'+isFirstSend)
			    if(isFirstSend) {   //如果为第一次发送消息，则把当前买家加入用户联系人列表
			    	var sql = "insert into contacts(userName, contactsName) values (?, ?)";
			    	conn.query(sql, [from, to], function(err, result) {
			    		if (err) {
			    			console.log("错误："+err);
			    		}
			    		if (result) {
			    			console.log('插入结果：')
			    			console.log(result.insertId)
			    			relationId = result.insertId;
			    			console.log('关系id(第一次发送):'+relationId)
			    			insertMessage(from, to, msg, relationId);
			    		}
			    	});
			    }
			    console.log('关系id(不是第一次发送):'+relationId)
			    if(relationId != undefined){
			    	insertMessage(from, to, msg, relationId)
			    }
			}
		});
    	console.log(to+'是否在线:', to in users)
		//将消息插入数据库，并发送给客户端
		function insertMessage(from, to, msg, relationId) {
		    if(to in users){   //当前联系人在线
		    	users[to].emit('to'+to, {msg:msg, from: from}, function(sendSuccess){
		    		if(sendSuccess){
		    			//写入message数据表
		    			var sql = "insert into message(fromName, toName, content, type, belong) values (?, ?, ?, ?, ?)";
		    			conn.query(sql, [from, to, msg.content, msg.type, relationId], function(err, result) {
		    				if (err) {
		    					console.log("错误："+err);
		    				}
		    				if (result) {
		    					console.log({sendSuccess: '消息发送成功'});
		    				}
		    			});
		    		}
		    	});
		    	// users[from].emit('to'+from, {msg:msg});
		    } else {  //不在线，把消息存为对方的未读消息列表
		    	console.log('对方不在线');
		    	console.log(msg);
		    	var sql = "insert into message(fromName, toName, content, type, status, belong) values (?, ?, ?, ?, ?, ?)";
		    	conn.query(sql, [from, to, msg.content, msg.type, 0, relationId], function(err, result) {
		    		if (err) {
		    			console.log("错误："+err);
		    		}
		    		if (result) {
		    			console.log({sendFailed: '消息已写入未读列表'});
		    		}
		    	});
		    }
		}
	});
})

/*******************聊天室结束*********************/




// 监听端口
http.listen(3000, function(){
	console.log('success listen at port:3000......');
});
// app.listen(3000);

