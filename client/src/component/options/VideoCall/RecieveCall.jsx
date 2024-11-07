import React, {useEffect, useState, useContext, useRef} from 'react'
import { Box, Button, Typography} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { GlobalContext } from '../../../context/context';
import { io } from "socket.io-client";
// import {fetchUserMedia,createPeerConAndAddMediaTrack} from './VidCallScript'

const RecieveCall = () => {

    const callerID = useRef(null)
    
    const [peerConnection, setPeerConnection] = useState('')

    const {ICEServerConfig,showCallEndedText, setShowCallEndedText,localStream, setLocalStream,remoteStream, setRemoteStream} = useContext(GlobalContext)

    let newTabSocket;
    let newTabRecieveCallVarClientSide;
    let callerOfferInRecieverSide;
    let iceInfoRecieverSide=[];
    let temp;
    let   peerConnVar;
    const oneTimeOnly = useRef(true)
    let iceGathered = false;
    let  localStreamVar;
    let remoteStreamVar = new MediaStream()



    useEffect(()=>{



        const largeVideoEle = document.querySelector('#large-video');
        const smallVideoEle =  document.querySelector('#small-video');

        const findIceCandiAndSendToCallerFromReciever = async()=>{

            try{

                //  peerConnVar = await new RTCPeerConnection(ICEServerConfig)

                 //add tracks in peerconnection
                // console.log('adding track in peerconnection in reciever side')

                // localStream.getTracks().forEach(track => {
                //     peerConnVar.addTrack(track, localStream)
                // });

           



                // peerConnVar.addEventListener('icecandidate',(e)=>{
        
                //     console.log('iceCandi found in reciever side')
        
                //     if(e.candidate){
                //         // console.log(callerID)
                //         iceInfoRecieverSide = [...iceInfoRecieverSide,{

                //                 iceCandidate: e.candidate,
                //                 localUserId: newTabRecieveCallVarClientSide
                //             }
                //         ]
        
                //         // newTabSocket.emit('sendIceCandidateToSignalingServer',IceInfo) 
                      
                //     }

                // })

               
                   
                    // console.log(iceInfoRecieverSide)

                    if (iceGathered) {
                        console.log('24. ice candi collection recievr side complete')
                        newTabSocket.emit('iceCandiAddingComplete-in-reciever-side', iceInfoRecieverSide)
                    }else{
                        console.log('24. ice candi collection recievr side NOT complete')
                    }
                

            }catch(err){
                console.log(err)

            }
        }

        const createAnswerAndSetRemoteDescrip = async(callerOffer)=>{

            try{
                peerConnVar = await new RTCPeerConnection(ICEServerConfig)


                 localStreamVar = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
                if(localStreamVar){
                    // setLocalStream(localStreamVar)
                    largeVideoEle.srcObject = localStreamVar
                    smallVideoEle.srcObject = remoteStreamVar
                    largeVideoEle.play()
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
                })



             await peerConnVar.setRemoteDescription(callerOffer.localOffer);

             console.log('6. remoteDEscrip is set in reciever side so ice candi from caller can be set now')
             newTabSocket.emit('give-me-ice-candi-from-caller')////

             const answer = await peerConnVar.createAnswer();
             await peerConnVar.setLocalDescription(answer);
             
             console.log(callerOffer)
             console.log('15. caller offer is set as remote and answer as local')
             console.log('16. answer is sent to server socket')

             newTabSocket.emit('take-answer-and-set-remote-to-caller', answer)

          
          

             
             peerConnVar.addEventListener('icecandidate',(e)=>{
        
                console.log('iceCandi found in reciever side')
    
                if(e.candidate){
                    // console.log(callerID)
                    iceInfoRecieverSide = [...iceInfoRecieverSide,{

                            iceCandidate: e.candidate,
                            localUserId: newTabRecieveCallVarClientSide
                        }
                    ]
    
                    // newTabSocket.emit('sendIceCandidateToSignalingServer',IceInfo) 
                  
                }

                

            })

            peerConnVar.addEventListener('icegatheringstatechange', () => {
                // console.log(iceInfoRecieverSide)

                if (peerConnVar.iceGatheringState === 'complete') {
                    console.log('ice info recievr side complete')

                    iceGathered = true;
                }else{
                console.log('ice info recievr side is not complete')

                }
            })

            }catch(err){
                console.log(err)
            }


        }

        const saveIceCandiOfCaller = async(callerOffer)=>{
            
            // const candidate = new RTCIceCandidate(callerOffer.localIceCandidate)
            callerOffer.localIceCandidate.map((e)=>{
                 peerConnVar.addIceCandidate(e)

            })

            console.log('14. caller Ice Candi Are Added TO Reciever')

            // localStreamVar.getTracks().forEach(track => {
            //     peerConnVar.addTrack(track, localStreamVar)
            // });

            // peerConnVar.addEventListener('track',e=>{
            //     console.log("Got a track from the other peer!! How excting")
            //     console.log(e)
            //     // e.streams[0].getTracks().forEach(track=>{
            //     //     remoteStream.addTrack(track,remoteStream);
            //     //     console.log("Here's an exciting moment... fingers cross")
            //     // })
            // })

        

            // console.log('find and send ice candi of recievr side ot caller side')

            // await findIceCandiAndSendToCallerFromReciever()
        }

        


            // if(!newTabSocket){
            //     // newTabSocket = io.connect("http://localhost:3000") //backend is running in 3000
               
               

            // }

            if(oneTimeOnly.current){
                //no localstream means we have to get user media 
                // fetchUserMedia(setLocalStream, largeVideoEle, smallVideoEle)
            console.log('heere1')
            newTabSocket = io.connect("http://192.168.1.95:3000")

            newTabSocket.on("connect", () => {
                console.log('new Tab Socket of reciever side is connected with ID:', newTabSocket.id);
                newTabRecieveCallVarClientSide = newTabSocket.id
                newTabSocket.emit('i-am-new-tab-from-reciever-side', newTabSocket.id)
                
            }); 

            //
            oneTimeOnly.current = false


            }
          
            if(localStream){
                //if there is localstream then place it in the peer connection
                // console.log(newTabSocket)
                // console.log(callerID.current)
                // createPeerConAndAddMediaTrack(ICEServerConfig, localStream,smallVideoEle, setRemoteStream,setPeerConnection, newTabSocket,callerID)
                // createPeerConAndAddMediaTrackInRecieverSide()
                //call functi heer
            

            }

            newTabSocket.on('recieverIsOnlineSendOffer', (callerOffer)=>{
                console.log('5.offer from caler reached reaciever')
                createAnswerAndSetRemoteDescrip(callerOffer)

            })

            newTabSocket.on('save-ice-candi-of-caller', (callerOffer)=>{
                console.log('13. ice candi of caller raeched reciever')
                saveIceCandiOfCaller(callerOffer)
                console.log(callerOffer)
            })




         
     

            newTabSocket.on('end-call',()=>{
                // setIncomingCallModal(false)
                setShowCallEndedText('call ended!')
            })



            // newTabSocket.on('this-is-sender-id', (localUserConsumer)=>{
            //     console.log('asdasdjasdoiajdsiojrgeiojweriof')
            //     console.log(localUserConsumer)
            //     if(localUserConsumer){
            //         callerID.current = localUserConsumer
            //     }
            // })

            newTabSocket.on('console-log-offer', (callerOffer)=>{
                callerOfferInRecieverSide = {... callerOffer}
                console.log(`calleroffer In recievre side: `)
                console.log( callerOfferInRecieverSide)
            })

            // newTabSocket.on('place-this-in-remote-descrip',(callerOffer)=>{
            //     if(!temp){
            //         temp = callerOffer
            //         createAnswerAndSetRemoteDescrip(callerOffer)

            //     }
            // })
            newTabSocket.on('provide-ice-candi-to-caller',async()=>{

                console.log('23. ice candi is extracting from reciver')
                await findIceCandiAndSendToCallerFromReciever()

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


        const params = new URLSearchParams(window.location.search);

        const callerID = params.get('id');
        console.log(callerID)

        newTabSocket.emit('call-end-in-RecieveCall', callerID)


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

export default RecieveCall