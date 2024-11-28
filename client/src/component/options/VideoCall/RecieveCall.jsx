import React, {useEffect, useState, useContext, useRef} from 'react'
import { Box, Button, Typography} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import CallEndIcon from '@mui/icons-material/CallEnd';
import { GlobalContext } from '../../../context/context';
import { io } from "socket.io-client";


const RecieveCall = () => {

    const callerID = useRef(null)
    
    const [peerConnection, setPeerConnection] = useState('')

    const {ICEServerConfig,showCallEndedText, setShowCallEndedText,localStream, setLocalStream,remoteStream, setRemoteStream} = useContext(GlobalContext)

    let newTabSocket;
    let newTabRecieveCallVarClientSide;
    let callerOfferInRecieverSide;
    let iceInfoRecieverSide=[];
    
    let   peerConnVar;
    const oneTimeOnly = useRef(true)
    // const [mute, setMute] = useState(false);
    // const [hideVideo, setHideVideo] = useState(false)
    // const [audioTracks, setAudioTracks] = useState('')
    let audioTracks;
    let videoTracks;
    let mute = false;
    let hideVideo = false;
    let iceGathered = false;
    let  localStreamVar;
    let remoteStreamVar = new MediaStream()
    let largeVideoEle;
    let smallVideoEle;
    let innerHeight=0;

if(oneTimeOnly.current){
        //no localstream means we have to get user media 
        // fetchUserMedia(setLocalStream, largeVideoEle, smallVideoEle)
    console.log('heere1')
    newTabSocket = io.connect("https://192.168.18.76:3000")

    newTabSocket.on("connect", () => {
        console.log('new Tab Socket of reciever side is connected with ID:', newTabSocket.id);
        newTabRecieveCallVarClientSide = newTabSocket.id
        newTabSocket.emit('i-am-new-tab-from-reciever-side', newTabSocket.id)
        
    }); 

    console.log(newTabSocket)
    oneTimeOnly.current=false;

    }


    useEffect(()=>{

         largeVideoEle = document.querySelector('#large-video');
         smallVideoEle =  document.querySelector('#small-video');

         innerHeight = (window.innerHeight)-10;
         document.querySelector('.recieverWrapper').style.height = `${innerHeight}px`;
         console.log(innerHeight)

        const findIceCandiAndSendToCallerFromReciever = async()=>{

            try{

                    console.log('26. about to check if ice candi of reciever can be sent to caller...')                

                    if (iceGathered) {
                        console.log('27. ice candi at recievr are complete AND SENT!!!')
                        newTabSocket.emit('iceCandiAddingComplete-in-reciever-side', iceInfoRecieverSide)
                    }else{
                        console.log('27. ice candi st recievr are NOT complete. NOT SENT!')

                        // it was seen that reciver side was not sending its ice candi,
                        //this promise awaits until icegathered = true i.e. icegatheringState == complete
                        //if it is, its resolved and the line next that is this same func is called again this time with
                        //ice candi ready to be served to caller

                        const iceGatheringPromise = new Promise((resolve)=>{

                               const checkEveryFewTime = setInterval(()=>{

                                    if(iceGathered){
                                        clearInterval(checkEveryFewTime);
                                        resolve();
                                    }

                               },100)

              

                        });
            
            
                        await iceGatheringPromise;
                        findIceCandiAndSendToCallerFromReciever();
                    }
                

            }catch(err){
                console.log(err)

            }
        }



        const createAnswerAndSetRemoteDescrip = async(callerOffer)=>{

           
                console.log('8. creating rtc peer connection reciever side')

                peerConnVar = await new RTCPeerConnection(ICEServerConfig)
                console.log(peerConnVar)

                peerConnVar.addEventListener('icecandidate',(e)=>{
        
                    console.log('iceCandi found in reciever side')
        
                    if(e.candidate){
                        // console.log(callerID)
                        iceInfoRecieverSide = [...iceInfoRecieverSide,{
    
                                iceCandidate: e.candidate,
                                localUserId: newTabRecieveCallVarClientSide
                            }
                        ]
                      
                    }
    
                    
    
                });

                peerConnVar.addEventListener('icegatheringstatechange', () => {
                    // console.log(iceInfoRecieverSide)
    
                    if (peerConnVar.iceGatheringState === 'complete') {
                        console.log('ice info gathering in recievr side complete')
                    
                        iceGathered = true;
                       

                    }else{
                    console.log('ice info gathering in recievr side is not complete')
    
                    }
                });

           
            
           
            console.log('9. get reciever user media')

                localStreamVar = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
                audioTracks = localStreamVar.getAudioTracks();
                videoTracks = localStreamVar.getVideoTracks()[0];

                if(localStreamVar){
                    // setLocalStream(localStreamVar)
                    largeVideoEle.srcObject = localStreamVar
                    largeVideoEle.play()

                    smallVideoEle.srcObject = remoteStreamVar
                    smallVideoEle.play()
                   
                }

                localStreamVar.getTracks().forEach(track => {
                    peerConnVar.addTrack(track, localStreamVar)
                    console.log('track added into local stream recieervre: ')
                    console.log(track)
                });

                peerConnVar.addEventListener('track',e=>{
                    console.log("Got a track from the other peer!! How excting")
                    console.log(e)
                    e.streams[0].getTracks().forEach(track=>{
                        remoteStreamVar.addTrack(track,remoteStreamVar);
                        console.log("Here's an exciting moment... fingers cross")
                    })

                    console.log(remoteStreamVar)

    
                });

             await peerConnVar.setRemoteDescription(callerOffer.localOffer);

             console.log('10. remoteDEscrip is set in reciever side.')
            //  newTabSocket.emit('give-me-ice-candi-from-caller')

             const answer = await peerConnVar.createAnswer();
             await peerConnVar.setLocalDescription(answer);

             console.log('11. local description is set as answer in reciever')
             console.log('12. both local and remote are set in reciever side')

            //  newTabSocket.emit('take-answer-and-set-remote-to-caller', answer)

           

             console.log(callerOffer)
   
             console.log('13. answer from reciever is sent to server socket')

             newTabSocket.emit('take-answer-and-set-remote-to-caller', answer)

             if(remoteStreamVar.active){
                //place 
                // const tempStream = largeVideoEle.srcObject;

                // largeVideoEle.srcObject = smallVideoEle.srcObject; 
                // smallVideoEle.srcObject = tempStream;

                // largeVideoEle.onloadedmetadata = () => {
                //     largeVideoEle.play().catch((err) => console.error('Error playing large video:', err));
                // };

                // smallVideoEle.onloadedmetadata = () => {
                //     smallVideoEle.play().catch((err) => console.error('Error playing small video:', err));
                // };

                
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

            //  newTabSocket.emit('give-me-ice-candi-from-caller') comented rn


        }

        const saveIceCandiOfCaller = async(callerOffer)=>{
            
            
            callerOffer.localIceCandidate.map((e)=>{
                 peerConnVar.addIceCandidate(e)

            })

            console.log('24. caller Ice Candi Are Added TO Reciever')
            console.log('25. turn for reciever side to send its ice candi to caller.')


           

            await findIceCandiAndSendToCallerFromReciever()
        }

            newTabSocket.on('end-call',()=>{
                // setIncomingCallModal(false)
                setShowCallEndedText('call ended!')
            })

            newTabSocket.on('console-log-offer', (callerOffer)=>{
                callerOfferInRecieverSide = {... callerOffer}
                console.log(`calleroffer In recievre side: `)
                console.log( callerOfferInRecieverSide)
            })

            //here
            newTabSocket.on('save-ice-candi-of-caller', (callerOffer)=>{
                console.log('23. ice candi of caller reached reciever')
                console.log(callerOffer)
                saveIceCandiOfCaller(callerOffer)
            })
           
            newTabSocket.on('provide-ice-candi-to-caller',async()=>{
                console.log('23. ice candi is extracting from reciver')
                await findIceCandiAndSendToCallerFromReciever()

            })

            newTabSocket.on('recieverIsOnlineSendOffer', (callerOffer)=>{
                console.log('7.offer from caler reached reaciever')
                createAnswerAndSetRemoteDescrip(callerOffer)
            })

            return(()=>{
                // newTabSocket.disconnect()
                newTabSocket.off("connect")
                newTabSocket.off('end-call')
                newTabSocket.off('this-is-sender-id')
                newTabSocket.off('console-log-offer')
                newTabSocket.off('here-is-your-offer')
                newTabSocket.off('place-this-in-remote-descrip')
                newTabSocket.off('recieverIsOnlineSendOffer')
            newTabSocket.off('provide-ice-candi-to-caller')

                 newTabSocket.off('save-ice-candi-of-caller')
                
                

            })
        
    },[])

    const closeThisAndReturnToRoom=()=>{
        window.close()
    }

    const settEndText=()=>{

console.log(newTabSocket)
        const params = new URLSearchParams(window.location.search);

        const callerID = params.get('id');
        console.log(callerID)

        newTabSocket.emit('call-end-in-RecieveCall', callerID)


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
    
        <Box className='recieverWrapper' style={{ }}>
    
    
    
            <Box style={{position: 'relative',height: '90%'}}>
                    
                    <video id="large-video" width="100%" height="100%" ></video>
    
                <Box style={{position: 'absolute',  height: '23%', width: '9%', left: '90%', top: '0%'}}>
                    <video id="small-video" width="100%" height="100%" ></video>
                    
    
                </Box>
            </Box>
            
            <Box style={{display: 'flex', justifyContent: 'space-evenly',height: '10%',alignItems: 'center'}}>
                
                <Box className='vidOn' sx={{display: 'block', '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <VideocamIcon onClick={()=>handleHideVideo('vidOn')}/>
                </Box>

                <Box className='vidOff' sx={{display: 'none', '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <VideocamOffIcon onClick={()=>handleHideVideo('vidOff')}/>
                </Box>

<Box sx={{ '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                <CallEndIcon onClick={settEndText} />
                </Box>

                <Box className='audioOn' sx={{display: 'block', '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <MicIcon onClick={()=>handleMuteVideo('audioOn')}/>
                </Box>

                <Box className='audioOff' sx={{display: 'none', '&:hover':{
                        cursor: 'pointer',
                        transform: 'scale(1.2)'
                    }}}>
                    <MicOffIcon onClick={()=>handleMuteVideo('audioOff')}/>
                </Box>

            </Box>
        
    
        </Box>
    
        :
    
        <Box className='recieverWrapper' style={{display: 'grid', placeItems: 'center'}}>
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

export default RecieveCall