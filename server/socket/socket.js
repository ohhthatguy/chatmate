const express = require('express')
// const cors = require('cors')
const fs = require('fs')
const https = require('https')
// const {Server} = require('socket.io')
const socketio = require('socket.io');
const app = express()


const key = fs.readFileSync('192.168.1.95-key.pem')
const cert = fs.readFileSync('192.168.1.95.pem')



const server = https.createServer({key,cert},app) //create a http server from express that handles the socket.io requests
//attach the socket.io to server with cors

//new Server = socketio
const io = socketio(server,{cors: {
//   origin: 'http://localhost:3001',      //react frontend is runing in 3001,
  origin: ['https://192.168.1.95:3001','*'],
  methods: ["GET", "POST", "UPDATE", "DELETE"]

}}) 

let roomIdServerVar;
let localUserConsumer;
let userInPrivateRoom = [];
let chatHistory = [];
let newTabFromCallerSide;
let newTabFromRecieverSide;
let recieverTabId;

let recieverOffer = {
    
        localUserId: '',
        localOffer: '',
        localIceCandidate: [],
        remoteUserId: '',
        remoteOffer: '',
        remoteIceCandidate: [],
        tabId: ''
    

};

let callerOffer = {
    
    localUserId: '',
    localOffer: '',
    localIceCandidate: [],
    remoteUserId: '',
    remoteOffer: '',
    remoteIceCandidate: [],
    tabId:''


};

const socket = ()=>{


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
           
            // console.log('chatSendMsgRoomID: ',roomIdServerVar)

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

//this gets active when the videocallicon is pressed, so this is the one which inititaes the call
//so the localUserId and remoteUserId are added here because this is the starting point of the vid call
        socket.on('show-incoming-call-modal-from-this-user', (caller, reciever)=>{
            console.log('///////////////////')
            console.log('caller:',caller.name)
            console.log('reciever:', reciever.name, reciever.id)
            console.log('|||||||||||||||||||||||')

            callerOffer = {...callerOffer, localUserId: caller.id, remoteUserId: reciever.id }
            // recieverOffer = {...recieverOffer, localUserId: reciever.id, remoteUserId: caller.id }


            // console.log(offer)

            socket.to(reciever.id).emit('show-incoming-call-modal-from-this-user-to-reciever', caller)

            
        })

        socket.on('i-am-new-tab-from-caller-side', (newTabSocketId)=>{
            // console.log('asjdoiasdj')
            newTabFromCallerSide = newTabSocketId;
            callerOffer = {...callerOffer, tabId: newTabSocketId}
          
        })

      

        socket.on('i-am-new-tab-from-reciever-side', (newTabSocket)=>{
            newTabFromRecieverSide = newTabSocket
            // recieverTabId = newTabSocket
            recieverOffer = {...recieverOffer, tabId: newTabSocket}

            // socket.emit('place-this-in-remote-descrip', callerOffer)
            // console.log(recieverTabId)
            console.log('4. revievr is online')
            console.log(newTabFromRecieverSide)
        
            io.to(newTabFromRecieverSide).emit('recieverIsOnlineSendOffer', callerOffer)

        })



//call end btn is pressed in reciever side
        socket.on('call-ended-in-reciever-side',(caller)=>{
            // console.log('call-ended-from-recievr')
            // console.log('caller: ', caller.id, caller.name)
            // console.log('newTabSocket: ', newTabFromCallerSide)

            socket.to(newTabFromCallerSide).emit('end-call')

        })
   
//call end btn is pressed in caller side
        socket.on('call-end-in-caller-side', (recieverId)=>{
            console.log('call-ended-from-calelr')
            console.log(recieverId)

            socket.to(recieverId).emit('end-call')
            if(newTabFromRecieverSide){
                socket.to(newTabFromRecieverSide).emit('end-call')
            }
        })

//call end on RecieveCall component
        socket.on('call-end-in-RecieveCall', (callerID)=>{

            socket.to(newTabFromCallerSide).emit('end-call')

        })

        // socket.on('sendIceCandidateToSignalingServer-in-caller-side',(IceInfo)=>{
        //     console.log(` caller side: ${IceInfo.localUserId}`)
        //     callerOffer = {...callerOffer, localIceCandidate: [...callerOffer.localIceCandidate, IceInfo.iceCandidate]}
        // })

        // socket.on('iceCandiAddingComplete-in-caller-side',(newTabCallerVarClientSide))

        // socket.on('')


        // socket.on('sendIceCandidateToSignalingServer',(IceInfo)=>{
           

        //     //it means the iceInfo contains the info of iceCandidates taken from the localUser i.e. the caller
        //     if(IceInfo.localUserId == newTabFromCallerSide){
        //         console.log(` caller side: ${IceInfo.localUserId}`)
        //         callerOffer = {...callerOffer, localIceCandidate: [...callerOffer.localIceCandidate, IceInfo.iceCandidate]}

        //     }

        //     if(IceInfo.localUserId == newTabFromRecieverSide){
        //         console.log(`reciever side: ${IceInfo.localUserId}`)
        //         recieverOffer = {...recieverOffer, localIceCandidate: [...recieverOffer.localIceCandidate, IceInfo.iceCandidate]}

        //     }
           
        //         // console.log('ice candi are aded')
        //         // offer = {...offer, localIceCandidate: [...offer.localIceCandidate, IceInfo.iceCandidate] }
        //         // console.log(offer)
           

        //     // console.log(offer)
        // }) 

        // socket.on('iceCandiAddingComplete',()=>{
        //     console.log('all ice candi are added successfully')

        //     if(callerOffer.tabId == newTabFromCallerSide){
        //         //sending calleroffer to recievr
        //         // socket.to(newTabFromRecieverSide).emit('console-log-offer', callerOffer)
        //         console.log(newTabFromRecieverSide)
        //         console.log('here1')
        //         callerOffer = []

        //     }

        //     if(recieverOffer.tabId == newTabFromRecieverSide){
        //         //sending recieveroffer to caller
        //         console.log(newTabFromCallerSide)
        //         console.log(newTabFromRecieverSide)
        //         socket.to(newTabFromCallerSide).emit('console-log-offer', recieverOffer)
        //         console.log('here2')
        //         recieverOffer = []

        //     }

       
            
        // })

        // socket.on('iceCandiAddingComplete-in-caller-side', ()=>{
            
        // })

        // socket.on('iceCandiAddingComplete-in-reciever-side', (iceInfoRecieverSide)=>{

        //     //ice candi is comeplete in reciever side only when reciever has accepted the call. if iceinfoRecievesdie is okay we can start the offer exchange process.


        //     // console.log('///recievr ice')
        //     // console.log(iceInfoRecieverSide)
        //     // console.log('///recievr ice')
        //     console.log('///recievr offer')
            

        //     iceInfoRecieverSide.map((e)=>{
        //         recieverOffer = {...recieverOffer, localIceCandidate: [...recieverOffer.localIceCandidate, e.iceCandidate]}
        //     })

        //     console.log(recieverOffer)

        //     //iceCandi of both caller and reciever should be added in this point. now we should initiate offer exchacnge betweeen users.

            
        //     console.log(newTabFromCallerSide);
        //     console.log(newTabFromRecieverSide)

        //     socket.to(newTabFromCallerSide).emit('offer-from-recievr', recieverOffer)

        //     socket.to(newTabFromRecieverSide).emit('offer-from-caller', callerOffer)
        // })

        // socket.on('pass-offer-to-reciever', (offer)=>{

        // })

        // socket.on('pass-offer-to-reciever', (offer)=>{

        // })



        socket.on('iceCandiAddingComplete-in-caller-side', (iceInfoCallerSide)=>{

            // console.log('///caller ice')
            // // console.log(iceInfoCallerSide)
            // console.log('///caller ice')
            console.log('///11. ice candi from caller reached socketserver///')            

            iceInfoCallerSide.map((e)=>{
                callerOffer = {...callerOffer, localIceCandidate: [...callerOffer.localIceCandidate, e.iceCandidate]}
            })
            
            // console.log(callerOffer)
            console.log('12. caller ice candi is sent to reciver')

            socket.to(newTabFromRecieverSide).emit('save-ice-candi-of-caller', callerOffer)
            

        })

        socket.on('iceCandiAddingComplete-in-reciever-side', (iceInfoRecieverSide)=>{
            console.log('///25. ice candi from reciver reached socketserver///')     
            
            iceInfoRecieverSide.map((e)=>{
                recieverOffer = {...recieverOffer, localIceCandidate: [...recieverOffer.localIceCandidate, e.iceCandidate]}
            })

            console.log(recieverOffer)
            console.log('26. recever ice candi is sent to caller')
            socket.to(newTabFromCallerSide).emit('save-ice-candi-of-reciever', recieverOffer)



        })


        socket.on('take-answer-and-set-remote-to-caller', (answer)=>{
            console.log('17. answer from reciever reached socket server')
            // console.log(answer)
            io.to(newTabFromCallerSide).emit('set-remote-descrip-this-answer', answer)
        })

        socket.on('give-me-ice-candi-from-reciever',()=>{
            console.log('22. requesting recievr for its ice candi from server')
            io.to(newTabFromRecieverSide).emit('provide-ice-candi-to-caller')
        })

        socket.on('give-me-ice-candi-from-caller',()=>{
            console.log('7. requesting caller id for its icecandi from reciever')
            io.to(newTabFromCallerSide).emit('provide-ice-candi-to-reciever')
        })






     



        // socket.on('save-offer-from-reciever-side', (localOffer)=>{
        //     console.log('saving offer from reciever user')
        //     recieverOffer = {...recieverOffer, localOffer: localOffer}
        //     // console.log(offer)
        // })

        socket.on('save-offer-from-caller-side', (localOffer)=>{
            console.log('3.saving offer from caller user')
            callerOffer = {...callerOffer, localOffer: localOffer}
            // console.log(offer)
        })



       


        






        socket.on('disconnect', () => {
           
            console.log(`User disconnected with ID: ${socket.id}`);

        });
      });




}

//this server is for socket.io fucntion only that is written in socket.js file
server.listen(3000, () => {
    userInPrivateRoom = []
    chatHistory = []
     recieverOffer = {
    
        localUserId: '',
        localOffer: '',
        localIceCandidate: [],
        remoteUserId: '',
        remoteOffer: '',
        remoteIceCandidate: [],
        tabId: ''
    

};

 callerOffer = {
    
    localUserId: '',
    localOffer: '',
    localIceCandidate: [],
    remoteUserId: '',
    remoteOffer: '',
    remoteIceCandidate: [],
    tabId:''


};
   
    console.log('socket.io server is running in 3000');
});



module.exports = socket
