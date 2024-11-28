import React,{useContext, useEffect, useState} from 'react'
import Room from '../Room'
import { Box, Typography,Button,TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GlobalContext } from '../../../context/context';

const CreateRoom = () => {

  const {socket,localUser,setLocalUser,room,setRoom,message,setMessage,showModal, setShowModal} = useContext(GlobalContext)

  // const [showModal, setShowModal] = useState(true)
 
//when a user is added chnage the show modal to false


// console.log(room)
  useEffect(()=>{
    //send a function to create a room with a unique id and show that to this
    setLocalUser(prev=>({...prev, creator:true}))  
    socket.emit('create-unique-roomID-for-private-room', localUser)
      

    socket.on('give-room-creator-detail',()=>{
      socket.emit('take-room-creator-detail', localUser)
    })          


  
      socket.on('send-unique-roomID-for-private-room', (roomId,localUser)=>{
          setRoom(({roomID: roomId, roomCreaterName: localUser.name, roomCreaterID: localUser.id}))
          setLocalUser(prev=>({...prev, roomID:roomId}))  

      })

      socket.on('user-joined-remove-blur-in-createRoom',()=>{
        setShowModal(false)
      })



      // console.log(message)
      return (()=>{
        // socket.disconnect()
        socket.off()
      })

  },[])

  // console.log(localUser)
// console.log(room)
  return (
    <>
    
    <Box style={{position: 'relative', height: '100vh', border: '0px solid green', backgroundImage: 'radial-gradient(circle, #191970 0%, black 100%)'}}>

<Box style={{ position: 'relative', top: '30%', left: '6%' , width: '90%', display: showModal ? 'block' : 'none', zIndex:'1'}}>

    <Box style={{textAlign: 'center', padding: '1rem'}}> 

        <Typography variant='h5' sx={{fontFamily: '"Oswald", sans-serif'}}>{` Your Private ROOM ID: ${room.roomID} `}</Typography>
        <Typography variant='h6'>  Waiting for users... </Typography>

    </Box>

</Box>

<Room/>


</Box>

    </>
  )
}

export default CreateRoom