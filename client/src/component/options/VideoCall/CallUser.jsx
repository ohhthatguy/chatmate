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
 
    const [offerFromOther, setOfferFromOther] = useState('')

    //new socket instance is needed for the component in a new Tab
    let newTabSocket
    let  peerConnVar;
    let REMOTESTREAM;
    let iceGathered = false;
    let localStreamVar;
    let remoteStreamVar = new MediaStream();
    // useEffect(()=>{


       

    //      newTabSocket = io.connect("http://localhost:3000") //backend is running in 3001

    //      newTabSocket.on("connect", () => {
    //         console.log('new Tab Socket connected with ID:', newTabSocket.id);
    //         newTabSocket.emit('i-am-new-tab-from-caller-side', newTabSocket.id)
            
    //     });  

    //     newTabSocket.on('end-call',()=>{
    //         // setIncomingCallModal(false)
    //         setShowCallEndedText('call ended!')
    //     })

    //     //fetch media
        







    //     return(()=>{
    //         // newTabSocket.disconnect()
    //         newTabSocket.off("connect")
    //         newTabSocket.off('end-call')
    //     })

    // },[])


    //for video call script
   
    
        

    useEffect(()=>{

        const largeVideoEle = document.querySelector('#large-video');
        const smallVideoEle =  document.querySelector('#small-video');


        if(oneTimeOnly.current){
            console.log('heere1')

            // newTabSocket = io.connect("http://localhost:3000") //backend is running in 3000
            newTabSocket = io.connect("http://192.168.1.95:3000")

            newTabSocket.on("connect", () => {
                console.log('new Tab Socket connected with ID:', newTabSocket.id);
                newTabCallerVarClientSide = newTabSocket.id
    
                newTabSocket.emit('i-am-new-tab-from-caller-side', newTabSocket.id)
    
                
            });

            oneTimeOnly.current = false
      

        }

        const saveIceCandiOfreciever = async(recieverOffer)=>{
            
            recieverOffer.localIceCandidate.map((e)=>{
             peerConnVar.addIceCandidate(e)
                
            })
            // const candidate = new RTCIceCandidate(recieverOffer.localIceCandidate)

            console.log('28. reciever Ice Candi Are Added TO caller')
            console.log('29. ice candi are succesffuly exchaneged on both side')
          

        
        }

        const FindAndShareIceCandiFromCaller = ()=>{
            try{
      


                console.log('9.taking in ice candidiates in caller-side')
                //  peerConnVar = await new RTCPeerConnection(ICEServerConfig)


                    if (iceGathered) {
                        console.log('10.all ice candi are added completely')
                        newTabSocket.emit('iceCandiAddingComplete-in-caller-side', iceInfoCallerSide)
                    }else{
                        console.log('10.all ice candi are not added completely')

                    }
              

            }catch(err){
                console.log(err)

            }

        }

        const setRemoteDescripAndAnswer = async(answer)=>{

            console.log('19. asnwer of reciever is set as remote to caller')
            //setting recievr offer as the remotedescript
            await peerConnVar.setRemoteDescription(answer)

            console.log('20. answer of reciever is savde as remote description to caller')

            console.log('21. since remote descrip of caller is set we can take iceCAndi from reciever and set here')
            newTabSocket.emit('give-me-ice-candi-from-reciever')

            // console.log('now we look for ice candi as setting offer and answer on both side are done')

            // await FindAndShareIceCandiFromReciverToSender()


// //answer has been set as local description 
//             console.log('anser is set as localdescription')

//             const answer = await peerConnVar.createAnswer()
//             await peerConnVar.setLocalDescription(answer)

            // peerConnVar.addEventListener('track',e=>{
            //     console.log("Got a track from the other peer!! How excting")
            //     console.log(e)


            //     // REMOTESTREAM = new MediaStream()
            //     // remoteVideoEl.srcObject = remoteStream;

            //     e.streams[0].getTracks().forEach(track=>{
            //         REMOTESTREAM.addTrack(track,remoteStream);
            //     })
            //     console.log("Here's an exciting moment... fingers cross")

            // })


        }

        const createOfferAndSendToReciever = async()=>{
            // return new Promise(async(resolve,reject)=>{

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
                        console.log('track added into local stream in caller: ')
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
                  



                    const offer = await peerConnVar.createOffer();
                    await peerConnVar.setLocalDescription(offer);
                    console.log('1. Offer set as local description in caller side');
                    
                    console.log('2. sending this offer to reciever');
                     newTabSocket.emit('save-offer-from-caller-side', offer)

                     peerConnVar.addEventListener('icecandidate',(e)=>{
        
                        console.log('iceCandi found')
            
                        if(e.candidate){
                            // console.log(callerID)
                            iceInfoCallerSide = [...iceInfoCallerSide,{
                                iceCandidate: e.candidate,
                                localUserId: newTabCallerVarClientSide
                            }
                            ]
            
                            // newTabSocket.emit('sendIceCandidateToSignalingServer-in-caller-side',IceInfo) 
                          
                        }
                    })

                    
                peerConnVar.addEventListener('icegatheringstatechange', () => {

                    if (peerConnVar.iceGatheringState === 'complete') {
                        console.log('all ice candi are added completely')
                        // newTabSocket.emit('iceCandiAddingComplete-in-caller-side', iceInfoCallerSide)
                        iceGathered = true
                    }else{
                        console.log('ice candi are not finished loading')
                    }
                })


                    // resolve()

                }catch(err){
                    console.log(err)
                    // reject()
                }

            // })
        }

        // if(oneTimeOnly.current){
        //     // newTabSocket = io.connect("http://localhost:3000") //backend is running in 3000
        //     newTabSocket = io.connect("http://192.168.1.95:3000")

        //     newTabSocket.on("connect", () => {
        //         console.log('new Tab Socket connected with ID:', newTabSocket.id);
        //         newTabCallerVarClientSide = newTabSocket.id
    
        //         newTabSocket.emit('i-am-new-tab-from-caller-side', newTabSocket.id)
    
                
        //     });

        //     oneTimeOnly.current = false
      

        // }

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

   

        




        
        if(localStream){
            
            // createPeerConAndAddMediaTrackInRecieverSide()

        }

    

        newTabSocket.on('console-log-offer', (recieverOffer)=>{
            recieverOfferInCallerSide = {... recieverOffer}
            console.log(`reeciever offer in caller side: `)
            console.log(recieverOfferInCallerSide)
        })

        newTabSocket.on('offer-from-recievr', (recieverOffer)=>{
            // setOfferFromOther(recieverOffer)
        })

        newTabSocket.on('set-remote-descrip-this-answer', (answer)=>{
            console.log('18. answer has reached the call user from server')
            console.log(answer)
            setRemoteDescripAndAnswer(answer)
        })

        newTabSocket.on('save-ice-candi-of-reciever', (recieverOffer)=>{
            console.log('27. ice candi of recievr has reached callerUSer Tab')
             saveIceCandiOfreciever(recieverOffer)
        })

        newTabSocket.on('provide-ice-candi-to-reciever',()=>{
            console.log('8. ice candi of caller are sent tos server')
            FindAndShareIceCandiFromCaller()
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

    // console.log(peerConnection)


    
  

    // if(localStream){
    //     document.getElementById('large-video').srcObject = localStream
    //     // document.getElementById('small-video').srcObject = localStream

    //     document.getElementById('large-video').play()
    //     // document.getElementById('small-video').play()


    // }

    const closeThisAndReturnToRoom=()=>{
        window.close()
    }

    const settEndText=()=>{


        const params = new URLSearchParams(window.location.search);

        const recieverId = params.get('id');
        console.log(recieverId)

        newTabSocket.emit('call-end-in-caller-side', recieverId)


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