import React, {useState, useContext, useEffect} from 'react'
import Room from '../Room'
import { Box, Typography,Button,TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GlobalContext } from '../../../context/context';




const EnterRoom = () => {
    // const [showModal, setShowModal] = useState(true)
    const [enteredRoomId, setEnteredRoomId] = useState('')

    const { message, setMessage,setLocalUser, localUser,room,setRoom, socket,showModal, setShowModal} = useContext(GlobalContext)

    useEffect(()=>{
        setLocalUser(prev=>({...prev, creator:false}))  

        // socket.emit('enterroom-is-opened')

        socket.on('roomId-is-right',(enteredRoomId)=>{

            setShowModal(false)
           setLocalUser(prev=>({...prev, roomID: enteredRoomId}))
            socket.emit('join-this-user-to-roomID', localUser)

        })

        socket.on('roomId-is-wrong',()=>{
            alert('Use Right ROOMID')
            setEnteredRoomId('')
        })

        socket.on('save-room-creator-detail',(localUserCreatorData,roomIDServerVar)=>{
            // console.log(localUserCreatorData)
            // console.log(localUser)
            setRoom({roomID: roomIDServerVar, roomCreatorName: localUserCreatorData.name, roomCreatorID: localUserCreatorData.id})
            setLocalUser(prev=>({...prev,creator: localUserCreatorData.name, roomID: roomIDServerVar}))
        })


        // socket.on('notif-that-this-user-is-room-creater-in-enterroom', (localUser)=>{
        //     setMessage(prev=>[...prev, { message: `${localUser.name} created the room.`, sender: 'System', senderId: '', roomId: '', isNotification: true}])
        // })

        

        return(()=>{
            socket.disconnect()
        })

    },[])
    
// console.log(room)
    const handleRoomID = ()=>{

        // console.log(enteredRoomId)

        socket.emit('check-if-roomID-is-correct', enteredRoomId)
        

    }

    // console.log(showModal)
    // console.log(message)
    // console.log(localUser)

  return (
    <Box style={{position: 'relative'}}>

        <Box style={{border: '1px solid white', position: 'absolute', top: '30%', left: '25%', width: '50%', padding: '0.5rem', display: showModal ? 'block' : 'none', zIndex:'1'}}>

            <Box style={{textAlign: 'center', padding: '1rem'}}> 

                <Typography variant='h5'>  ENTER ROOM ID </Typography>
            
            </Box>

            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem'}}>

                <TextField value={enteredRoomId} onChange={(e)=> setEnteredRoomId(e.target.value)} variant='outlined' label='Enter RoomID' style={{width: '60%'}} />
                    
                <SendIcon onClick={()=>handleRoomID()} fontSize='large'/>
                

            </Box>

        </Box>

        <Room/>
   

    </Box>
  )
}

export default EnterRoom