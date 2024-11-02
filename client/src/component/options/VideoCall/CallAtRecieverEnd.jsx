import React,{useContext, useEffect, useState} from 'react'
import { Box, Button, Dialog, DialogActions, DialogTitle, DialogContent} from '@mui/material';
import { GlobalContext } from '../../../context/context';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';


const CallAtRecieverEnd = ({caller}) => {


  const {incomingCallModal, setIncomingCallModal,showCallEndedText, setShowCallEndedText,socket} = useContext(GlobalContext)

  useEffect(()=>{

        socket.on('end-call',()=>{
          // setIncomingCallModal(false)
          console.log('here at end-call of callAtRecieverEnd')
          setShowCallEndedText('call ended!')
      })


      return(()=>{
        socket.off('end-call')
      })

  },[])


  const showCallEndingText = ()=>{
    socket.emit('call-ended-in-reciever-side',caller)
    setShowCallEndedText('Call Ended!')

  }

  const closeCallModal = ()=>{
    setIncomingCallModal(false)
    // setShowCallEndedText('')
  }



  return (
    <Dialog open={incomingCallModal} onClose={closeCallModal}>
            {/* <DialogTitle>Choose a User</DialogTitle> */}

            <DialogContent>
                
                        {
                        showCallEndedText.length>0 
                        ?
                   

                            <Box style={{textAlign: 'center'}}> {showCallEndedText} </Box>


       
                        :
                        <Box style={{textAlign: 'center'}}> {caller.name} is calling... </Box>

                    }
                
              
            </DialogContent>

          {
            showCallEndedText.length == 0 ?
            <DialogActions style={{display: 'flex', justifyContent: 'space-around', border: '1px solid red'}}>
              
                  <CallIcon />

                  <CallEndIcon onClick={showCallEndingText}/>

                  

            </DialogActions>
            :
            <DialogActions >
              
                  <Button variant='contained' onClick={closeCallModal} >Close</Button>

                  

            </DialogActions>

          }

        </Dialog>
  )
}

export default CallAtRecieverEnd