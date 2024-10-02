const express = require('express')
// const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
const app = express()


const server = http.createServer(app) //create a http server from express that handles the socket.io requests
//attach the socket.io to server with cors
const io = new Server(server,{cors: {
  origin: 'http://localhost:3001',      //react frontend is runing in 3001
  // methods: ["GET", "POST", "UPDATE", "DELETE"],
  credentials: true

}}) 


const socket = ()=>{

    console.log('here')

    io.on('connection', (socket) => {

        // console.log('a user connected with id: ', socket.id);

        socket.join("room1")


        // all socket in room1
        const roomSockets = io.sockets.adapter.rooms.get('room1');
        const connectedSockets = Array.from(roomSockets).map(e=>  (e))
            // console.log(connectedSockets)


            

        io.emit("AllConnectedPeople", connectedSockets)

        //sending messages
        socket.on("send-direct-message", (userName,msgRecipient,message)=>{
            console.log(`Message from ${userName} to ${msgRecipient}: ${message}.`);
            socket.to(msgRecipient).emit("mymessage", message , userName, msgRecipient)

            //notificaitng
            socket.to(msgRecipient).emit("notifying-that-message-is-recieved", userName)
        })

        

        


        socket.on('disconnect', () => {
            console.log('here')
            console.log(`User disconnected with ID: ${socket.id}`);
        });
      });




}

//this server is for socket.io fucntion only that is written in socket.js file
server.listen(3000, () => {
    console.log('socket.io server is running in 3000');
});



module.exports = socket



            // socket.on("sendMsg", (data)=>{
            //   console.log(data)
            //         // io.emit("revieveMsg",data)
            //         socket.broadcast.emit("revieveMsg",data)
            // })

