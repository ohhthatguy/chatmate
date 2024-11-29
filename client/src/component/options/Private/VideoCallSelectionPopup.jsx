import React,{useContext, useEffect, useState} from 'react'
import { Box, Button, Dialog, DialogActions, DialogTitle, DialogContent} from '@mui/material';
import { GlobalContext } from '../../../context/context';
import VideocamIcon from '@mui/icons-material/Videocam';
import Diversity3Icon from '@mui/icons-material/Diversity3';




const VideoCallSelectionPopup = () => {

    const { openVidCallSelectionModal, setOpenVidCallSelectionModal, socket,localUser, setRefreshList,setShowCallEndedText} = useContext(GlobalContext)
    const [peopleICanCall, setPeopleICanCall] = useState([])

    useEffect(()=>{

        // socket.on('take-people-in-room-excpet-me', (clients,userInPrivateRoom)=>{
        //     //clients means all the user in the socketIO private room excpet me
        //     //userInPrivateRoom has an arry of object where each object is {id: '', name: ''} of conncetd user including me

        //     let temp = userInPrivateRoom.filter((e)=> clients.includes(e.id)) // returns array of object of id and name of user that is not me and is in the room

        //     // console.log(temp)
        //     setPeopleICanCall(temp)

        // })

        socket.on('take-people-in-room-excpet-me', (peopleICanCallVar,userInPrivateRoom)=>{
            //peopleICanCallVar means all the user in the socketIO private room excpet me 
            //it has an arry of object that is [{id: '', status: ''}]. status is either 'readyToCall' or 'alreadyOnCall'

                let temp = [];
            // this function runs from all connected people in room and then based on their id give me thier name 
            // this name and thier sttaus is then sent to show if you cn call this person or not
                userInPrivateRoom.forEach(user => {
                    // Check if a matching ID exists in peopleICanCall
                    const person = peopleICanCallVar.find(person => person.id === user.id);
                    if (person) {
                      // Add a new object with id, status, and name to peopleICanCall
                      temp.push({
                        id: person.id,
                        status: person.status,
                        name: user.name,
                      });
                    }
                  });

            // console.log(peopleICanCallVar)
            setPeopleICanCall(temp)

        })


        // console.log(peopleICanCall)
        return (()=>{
            // socket.disconnect()
            socket.off('take-people-in-room-excpet-me');
          })
    },[socket])


    const closeVidCallSelectionModal = ()=>{
        setOpenVidCallSelectionModal(false)
    }

    const handleVideoCall = (e)=>{
        // console.log(e) //gives id and name of the user we have clicked to call
        // console.log(localUser)
        socket.emit('show-incoming-call-modal-from-this-user', localUser,e)

        window.open(`/callUser?id=${e.id}`, '_blank')
     



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
                               
                                <Box sx={{ position: 'relative',}}>{e.name}</Box>

                                {e.status == 'readyToCall' ?
                                    <Box sx={{'&:hover':{cursor: 'pointer'}}}>

                                        <VideocamIcon onClick={()=> handleVideoCall(e)}/>

                                    </Box>

                                    :

                                    <Box sx={{
                                        cursor: 'pointer',
                                       
                                       
                                          '&::after': {
                                            content: '"busy"',
                                            position: 'absolute',
                                            top: '30%',
                                            right: '0%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'black',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                          },
                                          '&:hover::after': {
                                                opacity: 1,
                                                },
                                    }}>
                                        <Diversity3Icon />
                                    </Box>

                                }

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