const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(3000);
const io = socketIO(server);
const path = require("path");

let users = {};
let name = '';

app.get('/:name', function(req, res){
    name = req.params.name;
    res.sendFile(path.join(__dirname, "/index.html"));
});

io.sockets.on("connection", function(socket){
    users[socket.id] = name;

    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + "-online");
    });

    socket.on("node new message", function(data){
        io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    });

});
