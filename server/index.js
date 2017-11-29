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

//判断当前卖家是否是自己的历史联系人
function isHistoryContacts(userName, sellerName) {

	return flag;
}

io.on('connection', function (socket) {
	var isFirstSend = true; //是否是第一次向当前卖家发送消息, 默认为第一次
    console.log('socket连接成功!!!!!!!!!');

    socket.on('chat message', function (data) {  //接受事件
        console.log(data);
    });


    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    //建立聊天关系
    socket.on('comming in', function(data) {
    	if(data.username in users) {

    	} else {
    		var userName = data.userName;
    		users[userName] = socket; 
    		socket.emit('in', { text: '开始聊天' }); //发出事件
    	}
    });

    socket.on('private message', function (from,to,msg) {
	    console.log('消息接受成功：', from, ' 对 ',to, '说：',msg);
		/* 发送消息时，如果当前卖家是用户的历史练习人，则不是第一次发送  */
		var sql = "select * from contacts where userName = ? and contactsName = ?";
		var flag = true;
		conn.query(sql, [from, to], function(err, result) {
			if (err) {
				console.log("错误："+err);
			}
			if (result) {
				if(result.length == 0) {//没有该联系人则为第一次发送消息
				} else{
					isFirstSend = false;    //不是第一次发送
				} 
				console.log('isFirstSend:'+isFirstSend)
			    if(isFirstSend) {   //如果为第一次发送消息，则把当前买家加入用户联系人列表
			    	var sql = "insert into contacts(userName, contactsName) values (?, ?)";
					conn.query(sql, [from, to], function(err, result) {
						if (err) {
							console.log("错误："+err);
						}
						if (result) {
							console.log('插入结果：')
							console.log(result)
						}
					});
			    }
				
			}
		});


	    if(to in users){
	    	users[to].emit('to'+to, {msg:msg});
	    	// users[from].emit('to'+from, {msg:msg});
	    }
    });
})

/*******************聊天室结束*********************/




// 监听端口
http.listen(3000, function(){
	console.log('success listen at port:3000......');
});
// app.listen(3000);

