import React, {useEffect, useState, useContext, useRef} from 'react'
import { Box, Button, Typography} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import CallEndIcon from '@mui/icons-material/CallEnd';
import { GlobalContext } from '../../../context/context';
import { io } from "socket.io-client";



const CallUser = () => {
    let newTabCallerVarClientSide;
    let recieverOfferInCallerSide;
    let iceInfoCallerSide = [];


  

    const {ICEServerConfig,showCallEndedText, setShowCallEndedText,localStream, setLocalStream,remoteStream, setRemoteStream} = useContext(GlobalContext)
    
    const oneTimeOnly = useRef(true)
   
   

    let newTabSocket
    let  peerConnVar;
    let REMOTESTREAM;
    let iceGathered = false;
    let localStreamVar;
    let remoteStreamVar = new MediaStream();
let audioTracks;
let videoTracks;
    let largeVideoEle;
    let smallVideoEle;
    let innerHeight = 0;
   
    
    if(oneTimeOnly.current){

        console.log('heere1')

       
         newTabSocket = io.connect(process.env.REACT_APP_URL_TO_BACKEND);
        console.log(newTabSocket)

        newTabSocket.on("connect", () => {
            console.log('new Tab Socket connected with ID:', newTabSocket.id);
            newTabCallerVarClientSide = newTabSocket.id

            newTabSocket.emit('i-am-new-tab-from-caller-side', newTabSocket.id)

            
        });


        oneTimeOnly.current = false
    }
        

    useEffect(()=>{

         largeVideoEle = document.querySelector('#large-video');
         smallVideoEle =  document.querySelector('#small-video');

         innerHeight = (window.innerHeight)-10;
         document.querySelector('.callerWrapper').style.height = `${innerHeight}px`;
         console.log(innerHeight)


        const createOfferAndSendToReciever = async()=>{
          
                // try{
                    console.log('1. creating rtc peer connection caller side')

                    peerConnVar = await new RTCPeerConnection(ICEServerConfig)
                    console.log(peerConnVar)


                peerConnVar.addEventListener('icecandidate',(e)=>{
        
                    console.log('iceCandi found')
                    if(e.candidate){
                         iceInfoCallerSide = [...iceInfoCallerSide,{
                            iceCandidate: e.candidate,
                            localUserId: newTabCallerVarClientSide
                        }
                        ]
                        
                    }
                })

                    
                peerConnVar.addEventListener('icegatheringstatechange', () => {

                    if (peerConnVar.iceGatheringState === 'complete') {
                        console.log('all ice candi are gathered completely')
                    
                        iceGathered = true
                    }else{
                        console.log('ice candi are not gathered fully')
                    }
                })

                console.log('2. getting caller media')
                localStreamVar = await navigator.mediaDevices.getUserMedia({video: true, audio: true})

                 audioTracks = localStreamVar.getAudioTracks();
                 videoTracks = localStreamVar.getVideoTracks()[0];

                console.log(localStreamVar)
                    if(localStreamVar){
                        largeVideoEle.srcObject = localStreamVar
                        largeVideoEle.play()

                        smallVideoEle.srcObject = remoteStreamVar
                        smallVideoEle.play()
                       
                    }

                    localStreamVar.getTracks().forEach(track => {
                        peerConnVar.addTrack(track, localStreamVar)
                        console.log('track added into local stream in caller: ')
                        console.log(track)
                    });

                    peerConnVar.addEventListener('track',e=>{
                        console.log("Got a track from the other peer ")
                        console.log(e.streams)
                        e.streams[0].getTracks().forEach(track=>{
                            remoteStreamVar.addTrack(track,remoteStreamVar);
                            console.log("Here's an exciting moment... fingers cross")
                        })
                       
                        console.log(remoteStreamVar)
                   
    
                    });

                    
                    const offer = await peerConnVar.createOffer();
                    await peerConnVar.setLocalDescription(offer);
                    console.log('3. Offer set as local description in caller side');
                    
                    console.log('4. sending this offer to reciever');

                    newTabSocket.emit('save-offer-from-caller-side', offer)
           
        }
       

        const saveIceCandiOfreciever = async(recieverOffer)=>{
            
            recieverOffer.localIceCandidate.map((e)=>{
             peerConnVar.addIceCandidate(e)
                
            })

            console.log('31. reciever Ice Candi Are Added TO caller')
            console.log('32. ice candi are succesffuly exchaneged on both side')

//swap media on large and small vid element after eeveyr major work is done
            if(remoteStreamVar.active){
               

                                const tempLargeStream = largeVideoEle.srcObject;
                const tempSmallStream = smallVideoEle.srcObject;

                // Temporarily set both srcObject to null with a small delay to allow proper cleanup
                setTimeout(() => {
                    largeVideoEle.srcObject = null;
                }, 100);

                // Set the srcObject for large video element to the small stream after clearing the previous one
                setTimeout(() => {
                    largeVideoEle.srcObject = tempSmallStream;
                    largeVideoEle.onloadedmetadata = () => {
                        console.log('Large video stream loaded');
                        largeVideoEle.play().catch((err) => console.error('Error playing large video:', err));
                    };
                }, 200); // Delay to ensure the previous `srcObject = null` is processed before reassigning

                // Temporarily clear the small video element stream with a slight delay
                setTimeout(() => {
                    smallVideoEle.srcObject = null;
                }, 300);

                // Set the srcObject for small video element to the large stream after clearing the previous one
                setTimeout(() => {
                    smallVideoEle.srcObject = tempLargeStream;
                    smallVideoEle.onloadedmetadata = () => {
                        console.log('Small video stream loaded');
                        smallVideoEle.play().catch((err) => console.error('Error playing small video:', err));
                    };
                }, 400); // Slight delay before assigning the large stream to the small video

         
            }
          
        }

        const FindAndShareIceCandiFromCaller = async()=>{
            try{
      


                console.log('19.About to check if ice candi can be sent from caller side...')
                
                    if (iceGathered) {
                        console.log('20.all ice candi are gathered completely AND SENT!!!!')
                        newTabSocket.emit('iceCandiAddingComplete-in-caller-side', iceInfoCallerSide)
                    }else{
                        console.log('20.all ice candi are not gathered completely. NOT SENT!!');

                        const iceGatheringPromise = new Promise((resolve)=>{

                            const checkEveryFewTime = setInterval(()=>{

                                 if(iceGathered){
                                     clearInterval(checkEveryFewTime);
                                     resolve();
                                 }

                            },100)

           

                     });
         
         
                     await iceGatheringPromise;
                     FindAndShareIceCandiFromCaller();

                    }
              

            }catch(err){
                console.log(err)

            }

        }

        const setRemoteDescripAndAnswer = async(answer)=>{

            console.log('16. asnwer of reciever is set as remote to caller')
           
            await peerConnVar.setRemoteDescription(answer)

            console.log('17. local and remote are set of caller too! ')

            console.log('18. work of ice candi start now from caller side!!')

            await FindAndShareIceCandiFromCaller()



        }

        if(!localStream){
            //no localstream means we have to get user media 
            // fetchUserMedia(setLocalStream, largeVideoEle, smallVideoEle)

            //create offer and send to recievre without waiting for ice candi to finish loading
            createOfferAndSendToReciever()



        }
  
              
    console.log(newTabSocket)

        newTabSocket.on('end-call',()=>{
            // setIncomingCallModal(false)
            setShowCallEndedText('call ended!')
        })

        newTabSocket.on('console-log-offer', (recieverOffer)=>{
            recieverOfferInCallerSide = {... recieverOffer}
            console.log(`reeciever offer in caller side: `)
            console.log(recieverOfferInCallerSide)
        })

        newTabSocket.on('save-ice-candi-of-reciever', (recieverOffer)=>{
            console.log('30. ice candi of recievr has reached callerUSer Tab')
             saveIceCandiOfreciever(recieverOffer)
        })

        newTabSocket.on('provide-ice-candi-to-reciever',()=>{
            console.log('8. started process of ice candi of caller sending to server')
            FindAndShareIceCandiFromCaller()
        })

        newTabSocket.on('set-remote-descrip-this-answer', (answer)=>{
            console.log('15. answer has reached the call user from server')
            console.log(answer)
            setRemoteDescripAndAnswer(answer)
        })
        
        return(()=>{
            // newTabSocket.disconnect()
            newTabSocket.off("connect")
            newTabSocket.off('end-call')
            newTabSocket.off('this-is-sender-id')
            newTabSocket.off('console-log-offer')
            newTabSocket.off('here-is-your-offer')
            newTabSocket.off('offer-from-recievr')
            newTabSocket.off('set-remote-descrip-this-answer')
            newTabSocket.off('save-ice-candi-of-reciever')
        newTabSocket.off('provide-ice-candi-to-reciever')

        
        })

    },[])


    const closeThisAndReturnToRoom=()=>{
        window.close()
    }

    const settEndText=()=>{

console.log(newTabSocket)
        const params = new URLSearchParams(window.location.search);

        const recieverId = params.get('id');
        console.log(recieverId)

        newTabSocket.emit('call-end-in-caller-side', recieverId)


        setShowCallEndedText('call Ended!')
    }

    const handleHideVideo = (status)=>{
        console.log('vidSatus: ', status)

        if(status == 'vidOn'){
            videoTracks.enabled = false; // Disable the video track (hide the video)
            
            document.querySelector('.vidOn').style.display = 'none';
            document.querySelector('.vidOff').style.display = 'block';

        }else{

            videoTracks.enabled = true; // Disable the video track (hide the video)
           
            document.querySelector('.vidOn').style.display = 'block';
            document.querySelector('.vidOff').style.display = 'none';
           
        }
    }

    const handleMuteVideo = (status)=>{
        console.log('audio : ', status);
        console.log(audioTracks)
        
        if(status == 'audioOn'){
            // localStreamVar.getAudioTracks().forEach(track => track.stop());
            audioTracks[0].enabled = false;
            document.querySelector('.audioOn').style.display = 'none';
            document.querySelector('.audioOff').style.display = 'block';

            // mute = true;
            // setMute(true)
        } else{
            audioTracks[0].enabled = true;
            document.querySelector('.audioOn').style.display = 'block';
            document.querySelector('.audioOff').style.display = 'none';
            // setMute(false)
        } 
    }

    console.log(newTabSocket)

  return (
<>
{
    showCallEndedText.length == 0 ?

    <Box className='callerWrapper' style={{}}>




        <Box style={{position: 'relative',height: '90%'}}>
                
                <video id="large-video" width="100%" height="100%"  ></video>

            <Box style={{position: 'absolute', height: '23%', width: '9%', left: '90%', top: '0%'}}>
                <video id="small-video" width="100%" height="100%" ></video>
                

            </Box>
        </Box>
        
        <Box style={{display: 'flex', justifyContent: 'space-evenly',height: '10%',alignItems: 'center'}}>
 

                <Box className='vidOn' sx={{display: 'block',
                     '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }
                }}>
                    <VideocamIcon onClick={()=>handleHideVideo('vidOn')}/>
                </Box>

                <Box className='vidOff' sx={{display: 'none',  '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <VideocamOffIcon onClick={()=>handleHideVideo('vidOff')}/>
                </Box>

                <Box sx={{
                    '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }
                }}>
                    <CallEndIcon onClick={settEndText} />
                </Box>
                
                
                <Box className='audioOn' sx={{display: 'block',  '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <MicIcon onClick={()=>handleMuteVideo('audioOn')}/>
                </Box>

                <Box className='audioOff' sx={{display: 'none',  '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <MicOffIcon onClick={()=>handleMuteVideo('audioOff')}/>
                </Box>

               

        </Box>
    

    </Box>

    :

    <Box className='callerWrapper' style={{display: 'grid', placeItems: 'center'}}>
        <Box>
            <Box style={{textAlign: 'center'}}>
            {showCallEndedText}
            </Box>

            <Button variant='contained' onClick={closeThisAndReturnToRoom}>Close</Button>
        </Box>
    </Box>
}

</>
  )
}

export default CallUser