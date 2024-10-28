import React,{useContext, useState, useEffect, useRef} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import { GlobalContext } from '../../context/context';
import { Box, Typography,Button,TextareaAutosize } from '@mui/material';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import VideoCallSelectionPopup from './Private/VideoCallSelectionPopup';

import SendIcon from '@mui/icons-material/Send';



const Room = () => {

    const { localUser, message, setMessage,socket,showModal,room, setRoom,openVidCallSelectionModal, setOpenVidCallSelectionModal,refreshList} = useContext(GlobalContext)
    const [localMessage, setLocalMessage] = useState('')
    const tempRefreshFlag = useRef(false)
    // const location = useLocation()
    
    // console.log(location.pathname)


    useEffect(()=>{

     

        socket.on('notif-this-is-roomCreator', (localUserCreator)=>{
            setMessage(prev=>[...prev,{ message: `${localUserCreator.name} created the room.`, sender: 'System', senderId: '', roomId: localUser.roomID, isNotification: true}])
        })

        socket.on('recieve-msg',(message)=>{
            setMessage(prev=> ([...prev,{ message: message.message, sender: message.sender, senderId: message.senderId, roomId: message.roomId, isNotification: false}]))
            
        })

        socket.on('send-notif-that-this-user-joined', (localUser)=>{

            setMessage(prev=>[...prev,{ message: `${localUser.name} has joined the room.`, sender: 'System', senderId: '', roomId: localUser.roomID, isNotification: true}])
        }) 

        socket.on('send-unique-roomID-for-private-room', (roomId,localUser)=>{
            setRoom({roomID: roomId, roomCreater: localUser.name})
        })

        // socket.on('give-messages-until-now-to-display',()=>{
        //     console.log('here')
        //     console.log(message)
        //     // socket.emit('take-these-messages-until-now', message)
        // })

        socket.on('take-all-prev-msg', ()=>{
            console.log(message)
            

            if(message.length > 1){ //that is if message contains something other thatn the default initial mssge
                console.log(message.length)
                console.log(message)
                socket.emit('all-prev-msg', message)

            }
        })


        socket.on('chat-history-to-display', (chatHistory)=>{
            console.log('here')
            console.log(chatHistory)
            setMessage(chatHistory)

        })

       




          return (()=>{
            socket.disconnect()
          })  


    },[])


    const handleMessage=()=>{
        

        if(localMessage.length > 0){
       
            setMessage(prev=> ([...prev,{ message: localMessage, sender: localUser.name, senderId: localUser.id, roomId: localUser.roomID, isNotification: false}]))

            let temp = {message: localMessage, sender: localUser.name, senderId: localUser.id, roomId: localUser.roomID, isNotification: false}

            socket.emit('send-msg',message,temp)
            console.log(temp)

            setLocalMessage('') 
            
        }

       
            
    }

    const handleVideoCallSelection = ()=>{

        socket.emit('people-in-room-excpet-me', localUser)

        setOpenVidCallSelectionModal(true)
    }

//to refersh list
    useEffect(()=>{

        if(tempRefreshFlag.current){ //refresh only when dependency changes not on iniitla run

            socket.emit('people-in-room-excpet-me', localUser)

        }
        tempRefreshFlag.current = true


    },[refreshList])


    return (<Box>

        <Box style={{border: '2px solid red', height: '100vh', width: '100%' ,padding: '0.5rem', filter: showModal && 'blur(5px)', position: 'realtive'}}>

            {/* <Box style={{position: 'absolute', right: '0px', border: '1px solid white'}}>
                {`RoomID: ${room.roomID}`}
                <Box>
                </Box>
                
            </Box> */}

            <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', border: '1px solid white'}}>
                <Box> {`RoomID: ${room.roomID}`} </Box>
                <VideoChatIcon onClick={()=>handleVideoCallSelection()} fontSize='large'/>

            
            </Box>

            {/* msges seen here */}
           <Box style={{textAlign: 'center',display: 'flex', justifyContent:'flex-end', alignItems:'flex-start' ,  flexDirection: 'column' ,padding: '1rem', border: '1px solid white', height: '90%'}}> 
                
                   {
                    message.length > 0 && message.map((e,index)=>(

                         !e.isNotification ?
                            <Box key={index}>{`${e.sender}: ${e.message}`}</Box>
                            :
                            <Box key={index}>{`${e.sender}: ${e.message}`}</Box>
                            //this is a notification
                        
                    ))
                   }
                    

            </Box>


            {/* wrtie message here */}

             <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', border: '0px solid green'
             }}>

                <TextareaAutosize onChange={(e)=> setLocalMessage(e.target.value)}  value={localMessage} minRows={2} style={{resize: 'none', width: '70%'}} />
                <SendIcon onClick={()=> handleMessage()}/>


            </Box>

            {openVidCallSelectionModal && <VideoCallSelectionPopup />}


        </Box>



    
        </Box>)
}

export default Room