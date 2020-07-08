const express = require('express');
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')

const PORT = process.env.PORT||4000
const app = express();
const server = http.createServer(app);
const io = socketio(server)
const {addUser, removeUser, getUser, getAllUsers ,getUserIdByName} = require ('./utils/users.js')

io.on('connection', (socket) => {
    console.log("new user connection")

    //Join chat room
    socket.on('join',({name},callback)=>{
        const{error,user}=addUser({id: socket.id,name});

        if(error){
            console.log("error: "+error)
            callback({error:error})

        }

        console.log(name+" joined chat room")
        socket.emit('message', {user:'admin',text:'You have joined chat room'})
        socket.broadcast.to('chatroom').emit('message',{user:'admin', text: name+" has joined chatroom"})
        socket.join('chatroom')
        io.to('chatroom').emit('roomData',{users:getAllUsers()})
    })

    //Send Message

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(user.name+" send: "+message)
        io.to('chatroom').emit('message', { user: user.name, text: message });
        // io.to('chatroom').emit('roomData',{users:getAllUsers()})
        callback();
    });

    //send whisper
    socket.on('sendWhisper', (message,receiver, callback) => {
        const user = getUser(socket.id);
        const receiverId = getUserIdByName(receiver)
        io.to(receiverId).emit('message', { user: user.name, text: message });
        io.to(socket.id).emit('message', { user: user.name, text: message });

        // if(receiverId === ''){
        //     console.log("whisper receiver no longer exist")
        //     errCallback({error:"receiver "+"has left chat room"})
        // }
         callback();

    });


    //Disconnect
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to("chatroom").emit('message',{user:'admin',text: user.name+" has left chatroom"})
            io.to('chatroom').emit('roomData',{users:getAllUsers()})
        }
        console.log(user.name+' left chat room')
    })
})


app.use(router)
server.listen(PORT,()=> console.log('server start on port ' + PORT))
