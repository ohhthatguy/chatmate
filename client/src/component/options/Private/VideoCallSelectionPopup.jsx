import React,{useContext, useEffect, useState} from 'react'
import { Box, Button, Dialog, DialogActions, DialogTitle, DialogContent} from '@mui/material';
import { GlobalContext } from '../../../context/context';
import VideocamIcon from '@mui/icons-material/Videocam';




const VideoCallSelectionPopup = () => {

    const { openVidCallSelectionModal, setOpenVidCallSelectionModal, socket, setRefreshList} = useContext(GlobalContext)
    const [peopleICanCall, setPeopleICanCall] = useState([])

    useEffect(()=>{

        socket.on('take-people-in-room-excpet-me', (clients,userInPrivateRoom)=>{
            //clients means all the user in the socketIO private room excpet me
            //userInPrivateRoom has an arry of object where each object is {id: '', name: ''} of conncetd user including me

            let temp = userInPrivateRoom.filter((e)=> clients.includes(e.id)) // returns array of object of id and name of user that is not me and is in the room

            console.log(temp)
            setPeopleICanCall(temp)

        })


        console.log(peopleICanCall)
        return (()=>{
            // socket.disconnect()
            socket.off('take-people-in-room-excpet-me');
          })
    },[socket])


    const closeVidCallSelectionModal = ()=>{
        setOpenVidCallSelectionModal(false)
    }

    const handleVideoCall = (e)=>{
        console.log(e) //gives id and name of the user we have clicked to call
        window.open('/videocall', '_blank')



    }

    const handleRefresh = ()=>{
        setRefreshList(prev=> !prev)
    }


  return (
    
      

        <Dialog open={openVidCallSelectionModal} onClose={closeVidCallSelectionModal}>
            <DialogTitle>Choose a User</DialogTitle>

            <DialogContent>
                
               
                        {
                        peopleICanCall.length > 0 
                        ?
                         peopleICanCall.map((e,index)=>(
                            <Box style={{display: 'flex', justifyContent: 'space-between'}} key={index}>
                                <Box>{e.name}</Box>
                                <VideocamIcon onClick={()=> handleVideoCall(e)}/>
                            </Box>
                         ))
                        :
                        <Box>No One's Active</Box>
                    }
                
              
            </DialogContent>

            <DialogActions>
                <Button onClick={closeVidCallSelectionModal} variant='contained'>Close</Button>
                <Button onClick={handleRefresh} variant='contained'>Refresh</Button>

            </DialogActions>

        </Dialog>
        
 
  )
}

export default VideoCallSelectionPopup