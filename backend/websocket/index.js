let moment = require('moment');
let MessageModel = require('../models/message');


module.exports = (server) => {
    let io = require('socket.io')(server);
    let rooms = {};

    io.on('connection', (socket) => {
        console.log("socket连接得到");
        socket.on('enterRoom', (data) => {
            console.log("监听得到enterRoom");
            if (!rooms[data.roomId]) {
                rooms[data.roomId] = {};
            }
            rooms[data.roomId][data.username] = data;
            socket.join(data.roomId);
            io.to(data.roomId).emit('enterRoom', rooms[data.roomId]);
        })
        socket.on('leaveRoom', (data) => {
            if(rooms[data.roomId]) {
                if(rooms[data.roomId][data.username]) {
                    delete rooms[data.roomId][data.username];
                    io.to(data.roomId).emit('leaveRoom', rooms[data.roomId]);
                    socket.leave(data.roomId);
                }
            }
        })
        socket.on('sendMsg', (data) => {
            let msg = {
                username: data.username,
                avatar: data.avatar,
                content: data.content,
                img: data.img,
                roomId: data.roomId,
                created_at: moment().format('YYYY-MM-DD HH:mm')
            }
            // let newMsg = JSON.parse(JSON.stringify(msg));
            let newMsg = Object.assign({}, msg);
            newMsg.created_at = moment(newMsg.created_at, 'YYYY-MM-DD HH:mm').fromNow();
            io.to(data.roomId).emit('sendMsg', newMsg);
            if(!data.img && data.content) {
                MessageModel.create(msg).catch( (e) => {
                    console.log("error:"+ e);
                })
            }
        })
        socket.on('disconnect', () => {

        })
    })
}