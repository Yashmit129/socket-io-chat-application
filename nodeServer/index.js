// Node  server to handle socket io connection
const io = require("socket.io")(8000)
const fs = require('fs')
const users = {}
const { writeFile } = require("fs");

io.on('connection', socket => {
    socket.on('base64 file', function (msg) {
        console.log('received base64 file from' + msg.username);
        socket.username = msg.username;
        // socket.broadcast.emit('base64 image', //exclude sender
        io.sockets.emit('base64 file',  //include sender

            {
                username: socket.username,
                file: msg.file,
                fileName: msg.fileName
            }

        );
    });
    socket.on('new-user-joined', name => {
        console.log('new user', name)
        console.log(users)
        if (Object.values(users).includes(name)) {
            socket.emit('user-already-exist', name)
        } else {
            users[socket.id] = name
            socket.broadcast.emit('user-joined', name)
        }
        console.log('fn end')
    })
    socket.on('disconnect', name => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message, name: users[socket.id] })
    })

})

