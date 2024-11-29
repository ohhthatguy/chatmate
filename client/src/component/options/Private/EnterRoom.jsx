import React, {useState, useContext, useEffect} from 'react'
import Room from '../Room'
import { Box, Typography,Button,TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GlobalContext } from '../../../context/context';




const EnterRoom = () => {
    // const [showModal, setShowModal] = useState(true)
    const [enteredRoomId, setEnteredRoomId] = useState('')
    let isDarkMode = true;

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


        

        return(()=>{
            // socket.disconnect()
            socket.off('roomId-is-right')
            socket.off('roomId-is-wrong')
            socket.off('save-room-creator-detail')


        })

    },[])
    
// console.log(room)
    const handleRoomID = ()=>{

        // console.log(enteredRoomId)

        socket.emit('check-if-roomID-is-correct', enteredRoomId)
        

    }




   

  return (


<Box className='container' style={{position: 'relative', height: '100vh', border: '0px solid green', backgroundImage: 'radial-gradient(circle, #191970 0%, black 100%)'}}>

    <Box style={{ position: 'relative', top: '30%', left: '6%' , width: '90%', display: showModal ? 'block' : 'none', zIndex:'1'}}>

        <Box style={{textAlign: 'center', padding: '1rem'}}> 

            <Typography variant='h5' sx={{fontFamily: '"Oswald", sans-serif'}}>  ENTER ROOM ID </Typography>
        
        </Box>

        <Box style={{marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem',position: 'relative'}}>

            <TextField value={enteredRoomId} onChange={(e)=> setEnteredRoomId(e.target.value)} variant='outlined' label='Enter RoomID'  sx={{
                    width: '70%',
                  
                        input: {
                            color: isDarkMode ? 'white' : 'black',
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'gray' : 'black',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? 'white' : 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                        },
                    }} />
                
            <SendIcon onClick={()=>handleRoomID()} fontSize='large'/>
            

        </Box>

    </Box>

    <Room/>


</Box>
    
)

      



  
}

export default EnterRoom