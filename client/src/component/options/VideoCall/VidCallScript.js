


export const fetchUserMedia = async(setLocalStream, largeVideoEle, smallVideoEle)=>{
  
    try{
        const localStreamVar = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
      

        if(localStreamVar){
            setLocalStream(localStreamVar)
            largeVideoEle.srcObject = localStreamVar
            // smallVideoEle.srcObject = localStreamVar
            largeVideoEle.play()
            // smallVideoEle.play()
           
        }
    }catch(err){
        console.log('fetchusermedia is not fetching usermedia. ERROR: ', err)
    }
}

// export const createPeerConAndAddMediaTrack = async(ICEServerConfig,localStream, smallVideoEle,setRemoteStream,setPeerConnection,newTabSocket, callerID)=>{
    
//     try{
//         const peerConnVar = await new RTCPeerConnection(ICEServerConfig)
  
//         // smallVideoEle.srcObject = new MediaStream()
//         let remoteStreamVar;
//         // console.log(newTabSocket)
//         // setRemoteStream(remoteStreamVar)

//         if(localStream){

//             //add tracks in peerconnection
//             console.log('hererere')
//             localStream.getTracks().forEach(track => {
//                 peerConnVar.addTrack(track, localStream)
//             });

            

//             // // Create and set local description to start ICE candidate gathering

//             const offer = await peerConnVar.createOffer();
//             await peerConnVar.setLocalDescription(offer);
//             console.log('Offer set as local description');

//             newTabSocket.emit('save-offer-from-localUser', offer)

//             // setPeerConnection(peerConnVar)

//         }else{
//             console.log('tracks not filled in peer connection')
//         }
        
//         console.log('herer')

//         peerConnVar.addEventListener('icecandidate',(e)=>{

//             console.log('iceCandi found')

//             if(e.candidate){
//                 // console.log(callerID)
//                 const IceInfo = {
//                     iceCandidate: e.candidate,
//                     // localUserId: callerID.current.id
//                 }

//                 newTabSocket.emit('sendIceCandidateToSignalingServer',IceInfo) 
//                 // console.log(e.candidate)
//                 // console.log(localUser)
//                 // console.log(IceInfo)
//             }
//         })

//         peerConnVar.addEventListener('icegatheringstatechange', () => {

//             if (peerConnVar.iceGatheringState === 'complete') {
//                 newTabSocket.emit('iceCandiAddingComplete')
//             }
//         })
     
          

//             peerConnVar.addEventListener('track',e=>{
//                 console.log("Got a track from the other peer!! How excting")
//                 console.log(e)
//                 e.streams[0].getTracks().forEach(track=>{
//                     remoteStreamVar.addTrack(track,remoteStreamVar);
//                     console.log("Here's an exciting moment... fingers cross")
//                 })
//             })
           
        
    
//     }catch(err){
//         console.log(err)
//     }
    


// }


export const remoteStreamAndexchangeOffer = async()=>{




}