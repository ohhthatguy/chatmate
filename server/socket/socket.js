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

let roomIdServerVar;
let localUserConsumer;
let userInPrivateRoom = [];
let chatHistory = [];

const socket = ()=>{

    console.log('here')

    io.on('connection', (socket) => {

        console.log('a user connected with id: ', socket.id);

        socket.on('create-unique-roomID-for-private-room',(localUser)=>{
            roomIdServerVar = Math.floor(Math.random()*5000) //4digit unique roomID
            
            if(roomIdServerVar < 1000){
                roomIdServerVar = "0" + roomIdServerVar
            }else if(roomIdServerVar < 100){
                roomIdServerVar = "00" + roomIdServerVar
            }else if(roomIdServerVar < 10){
                roomIdServerVar = "000"+roomIdServerVar
            }


            //craetor joins the room
            socket.join(roomIdServerVar)
            console.log(`{${localUser.name} : ${localUser.id} can connect to roomId: ${roomIdServerVar}}`)
            userInPrivateRoom = [...userInPrivateRoom, {id: localUser.id, name: localUser.name}]

            
            socket.emit('notif-that-this-user-is-room-creater', localUser)
       

            io.emit('send-unique-roomID-for-private-room', roomIdServerVar,localUser )

         

        })


        socket.on('check-if-roomID-is-correct', (enteredRoomId)=>{

            if(roomIdServerVar == enteredRoomId){
                socket.emit('roomId-is-right', enteredRoomId)
            }else{
                socket.emit('roomId-is-wrong')

            }

        })

        //enterroom
        socket.on('join-this-user-to-roomID', (localUser)=>{

            localUserConsumer={...localUser}

            socket.join(roomIdServerVar)
            console.log(`{${localUser.name} : ${localUser.id} is connected to roomId: ${roomIdServerVar}}.`)
            userInPrivateRoom = [...userInPrivateRoom, {id: localUser.id, name: localUser.name}]

            //since now finally user beside the creater in joined to the same room, we can do funcitnalities

            socket.to(roomIdServerVar).emit('user-joined-remove-blur-in-createRoom')

            socket.to(roomIdServerVar).emit('give-room-creator-detail')  
 
        })

        socket.on('take-room-creator-detail', (localUserCreator)=>{

            io.to(roomIdServerVar).emit('save-room-creator-detail', localUserCreator,roomIdServerVar) //who is roomCreator is to be saved to both sender and reciver side

            io.to(roomIdServerVar).emit('notif-this-is-roomCreator', localUserCreator)
            io.to(roomIdServerVar).emit('send-notif-that-this-user-joined', localUserConsumer)  //who joined msg is to be seen to both sender and reciver side

            //take all the messages passed until now and then show this user every message that is not a notif i.e message exchanged between user
            // console.log('1')
            // console.log(chatHistory)

            // console.log('////')
            
            // console.log(chatHistory)

            
            // if(chatHistory.length > 0){

                //new user has enterd while other user are already connected
                chatHistory = [{ message: 'waiting for People to join...', sender: 'System', senderId: '', roomId: '', isNotification: true}, { message: `${localUserCreator.name} has joined the room.`, sender: 'System', senderId: '', roomId: localUserCreator.roomID, isNotification: true}]

                let temp = {message: `${localUserConsumer.name} has joined the room`, sender: 'System', senderId: '', roomId: '', isNotification: true}
                chatHistory = [...chatHistory, temp]

                // console.log(chatHistory)

                io.to(roomIdServerVar).emit('chat-history-to-display', chatHistory)
                chatHistory=[]

        // }
               
            

        })

        socket.on('all-prev-msg', (message)=>{
            socket.emit('chat-history-to-display', message) //display messages to other not him
        })


        socket.on('send-msg',(message,temp)=>{
            // console.log('2')
            
            // console.log(message)
            chatHistory = [...message,temp]
           
            // console.log(chatHistory)

            socket.to(roomIdServerVar).emit('recieve-msg',temp) //since the sender itself has already had the message and only other side has to take the message then
        })

        socket.on('people-in-room-excpet-me',(localUser)=>{
            let clients = io.sockets.adapter.rooms.get(roomIdServerVar)
            clients = [...clients]
            // console.log(clients)

            clients = clients.filter((e)=> e !== localUser.id)
            
            // console.log('////////////')
            // console.log(localUser.name)
            // console.log(clients)
            // console.log(userInPrivateRoom)
            socket.emit('take-people-in-room-excpet-me', clients,userInPrivateRoom)
            // socket.to(roomIdServerVar).emit('take-people-in-room-excpet-me', clients,userInPrivateRoom)
            // io.to(roomIdServerVar).emit('take-people-in-room-excpet-me', clients,userInPrivateRoom)


        })






        socket.on('disconnect', () => {
            userInPrivateRoom = []
            chatHistory = []
            console.log(`User disconnected with ID: ${socket.id}`);

        });
      });




}

//this server is for socket.io fucntion only that is written in socket.js file
server.listen(3000, () => {
    console.log('socket.io server is running in 3000');
});



module.exports = socket
