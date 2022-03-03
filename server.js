const e = require('express');
const path = require('path');
const socketio = require('socket.io')
const http = require('http')
const { JoinRoom, RoomNumberGet, UserLeave } = require('./utils/user')

const app = e();
const server = http.createServer(app); //手动创建一个http的server对象，并且把express放进来。
const io = socketio(server); //实例化socketio对象，并且把server放进来。将客户端的文件挂载到服务器上：http://127.0.0.1:8086/socket.io/socket.io.js
// on：听 emit：讲

io.on('connection', (socket) => {
    //对话操作放到join_room里面
    socket.on('join_room', ({ user_name, room }) => {
        socket.join(room)
        JoinRoom(socket.id, user_name, room)

        io.to(room).emit('uesr_room_data', (RoomNumberGet(room)))
        socket.to(room).emit('sys_message', 'connected');

        socket.on('chat_message', (message) => {
            io.to(room).emit('chat_message', message)
        })

        socket.on('disconnect', () => {
            UserLeave(socket.id)
            io.to(room).emit('uesr_room_data', (RoomNumberGet(room)))
        })
    })
})//确定客户连接进来

const PORT = process.env.PORT || 8086; // 先去服务器的环境变量找port，有则为port的值，没有设置为8086

app.use(e.static(path.join(__dirname, 'public'))) // /Users/chenguofeng/Code/JavaScript/Project/chat_rooom/SocketIO/chat-test/public


server.listen(PORT, () => {
    console.log("This server is running on port " + PORT);
}) // app改为server有http://127.0.0.1:8086/socket.io/socket.io.js可访问