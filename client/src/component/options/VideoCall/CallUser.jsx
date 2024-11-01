import React, {useEffect, useState, useContext} from 'react'
import { Box, Button, Typography} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { GlobalContext } from '../../../context/context';

const CallUser = () => {
    const {ICEServerConfig,showCallEndedText, setShowCallEndedText} = useContext(GlobalContext)
    const [localStream, setLocalStream] = useState('')
    const [peerConnection, setPeerConnection] = useState('')

    useEffect(()=>{
        
     
        const fetchUserMedia = async()=>{
            try{
                const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
                if(stream){
                    setLocalStream(stream)
                }
            }catch(err){
                console.log('fetchusermedia is not fetching usermedia. ERROR: ', err)
            }
        }

        const createPeerConAndAddMediaTrack = async()=>{
            try{
                const peerConnVar = await new RTCPeerConnection(ICEServerConfig)
                
                if(localStream){

              
                    //add tracks in peerconnection
                    localStream.getTracks().forEach(track => {
                        peerConnVar.addTrack(track, localStream)
                    });

              

                
                }else{
                    console.log('notfilled')
                }
            
            }catch(err){
                console.log(err)
            }
            


        }



        // if(localStream.length ==0 ){
        //     fetchUserMedia()

        // }
        // createPeerConAndAddMediaTrack()

    },[localStream])

    if(localStream){
        document.getElementById('large-video').srcObject = localStream
        // document.getElementById('small-video').srcObject = localStream

        document.getElementById('large-video').play()
        // document.getElementById('small-video').play()


    }

    const closeThisAndReturnToRoom=()=>{
        window.close()
    }

    const settEndText=()=>{
        setShowCallEndedText('call Ended!')
    }


  return (
<>
{
    showCallEndedText.length == 0 ?

    <Box style={{border: '1px solid red', height: '100vh'}}>


        
        <Box style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', height: '10%',border: '1px solid blue'}}>

          <Box>UserName</Box>
          <Box> calling... / connected</Box>

        </Box>

        <Box style={{position: 'relative',height: '80%',border: '1px solid green'}}>
                
                <video id="large-video" width="100%" height="100%" ></video>

            <Box style={{position: 'absolute', border: '1px solid brown', height: '23%', width: '9%', left: '90%', top: '0%'}}>
                <video id="small-video" width="100%" height="100%" ></video>
                

            </Box>
        </Box>
        
        <Box style={{display: 'flex', justifyContent: 'space-evenly',height: '10%',border: '1px solid yellow',alignItems: 'center'}}>
            <VideocamIcon />
            <CallEndIcon onClick={settEndText} />
            <MicIcon />
        </Box>
    

    </Box>

    :

    <Box style={{display: 'grid', placeItems: 'center'}}>
        <Box style={{textAlign: 'center'}}>
           {showCallEndedText}
        </Box>
        <Button variant='contained' onClick={closeThisAndReturnToRoom}>Close</Button>
    </Box>
}

</>
  )
}

export default CallUser