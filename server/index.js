const express = require('express');
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')

const PORT = process.env.PORT||4000
const app = express();
const server = http.createServer(app);
const io = socketio(server)
const {addUser, removeUser, getUser, getAllUsers} = require ('./utils/users.js')

io.on('connection', (socket) => {
    console.log("new user connection")

    socket.on('join',({name},callback)=>{
        const{error,user}=addUser({id: socket.id,name});

        if(error)
            callback({error:'error'})

        socket.emit('message', {user:'admin',text:'You have joined chat room'})
        socket.broadcast.to('chatroom').emit('message',{user:'admin', text: name+" has joined chatroom"})
        socket.join('chatroom')
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(user.name+" send: "+message)
        io.to('chatroom').emit('message', { user: user.name, text: message });
        callback();
    });

    socket.on('disconnect',()=>{
        console.log('user left chatroom')
    })
})

app.use(router)

server.listen(PORT,()=> console.log('server start on port ' + PORT))
