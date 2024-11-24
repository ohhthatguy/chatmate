import React, {useEffect, useState, useContext, useRef} from 'react'
import { Box, Button, Typography} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { GlobalContext } from '../../../context/context';
import { io } from "socket.io-client";
// import {fetchUserMedia,createPeerConAndAddMediaTrack} from './VidCallScript'
// import socket from '../../../../../server/socket/socket';


const CallUser = () => {
    let newTabCallerVarClientSide;
    let recieverOfferInCallerSide;
    let iceInfoCallerSide = [];


    // document.querySelector('#local-video');

    const {ICEServerConfig,showCallEndedText, setShowCallEndedText,localStream, setLocalStream,remoteStream, setRemoteStream} = useContext(GlobalContext)
    // const [callerID, setCallerID] = useState('')
    // const callerID = useRef(null)
    const oneTimeOnly = useRef(true)
   
    //new socket instance is needed for the component in a new Tab
    let mute = false;
    let hideVideo = false;
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
   
    
    if(oneTimeOnly.current){

        console.log('heere1')

       
         newTabSocket = io.connect("https://192.168.18.76:3000");
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
                        // newTabSocket.emit('iceCandiAddingComplete-in-caller-side', iceInfoCallerSide)

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
                        // if(remoteStreamVar.active){
                        //     //place 
                        //     const tempStream = largeVideoEle.srcObject; 
                        //     largeVideoEle.srcObject = smallVideoEle.srcObject; 

                        //     largeVideoEle.onloadedmetadata = () => {
                        //         console.log('here')
                        //         largeVideoEle.play().catch((err) => console.error('Error playing large video:', err));
                        //     };

                        //     smallVideoEle.srcObject = tempStream;
                        //     smallVideoEle.onloadedmetadata = () => {
                        //         console.log('here')

                        //         smallVideoEle.play().catch((err) => console.error('Error playing small video:', err));
                        //     };


                        // }
    
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
                //place 
                const tempStream = largeVideoEle.srcObject; 
                largeVideoEle.srcObject = smallVideoEle.srcObject; 

                largeVideoEle.onloadedmetadata = () => {
                    console.log('here')
                    largeVideoEle.play().catch((err) => console.error('Error playing large video:', err));
                };

                smallVideoEle.srcObject = tempStream;
                smallVideoEle.onloadedmetadata = () => {
                    console.log('here')

                    smallVideoEle.play().catch((err) => console.error('Error playing small video:', err));
                };


            }
          
        }

        const FindAndShareIceCandiFromCaller = ()=>{
            try{
      


                console.log('19.About to check if ice candi can be sent from caller side...')
                //  peerConnVar = await new RTCPeerConnection(ICEServerConfig)


                    if (iceGathered) {
                        console.log('20.all ice candi are gathered completely AND SENT!!!!')
                        newTabSocket.emit('iceCandiAddingComplete-in-caller-side', iceInfoCallerSide)
                    }else{
                        console.log('20.all ice candi are not gathered completely. NOT SENT!!')

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

    const handleHideVideo = ()=>{
        console.log('hideVideo: ', hideVideo)
        if(!hideVideo){
            videoTracks.enabled = false; // Disable the video track (hide the video)
            hideVideo = true;

        }else{

            videoTracks.enabled = true; // Disable the video track (hide the video)
            hideVideo = false;
        }
    }

    const handleMuteVideo = ()=>{
        console.log('muteAudio: ', mute);
        console.log(audioTracks)
        
        if(!mute){
            // localStreamVar.getAudioTracks().forEach(track => track.stop());
            audioTracks[0].enabled = false;
            mute = true;
            // setMute(true)
        } else{
            audioTracks[0].enabled = true;
            mute = false;
            // setMute(false)
        } 
    }

    console.log(newTabSocket)

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
                
                <video id="large-video" width="100%" height="100%"  ></video>

            <Box style={{position: 'absolute', border: '1px solid brown', height: '23%', width: '9%', left: '90%', top: '0%'}}>
                <video id="small-video" width="100%" height="100%" ></video>
                

            </Box>
        </Box>
        
        <Box style={{display: 'flex', justifyContent: 'space-evenly',height: '10%',border: '1px solid yellow',alignItems: 'center'}}>
            <VideocamIcon onClick={handleHideVideo}/>
            <CallEndIcon onClick={settEndText} />
            <MicIcon onClick={handleMuteVideo}/>
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