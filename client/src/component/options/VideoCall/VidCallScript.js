
//caller and reciever 
export const createRTCConnection = async(peerConnVar,ICEServerConfig)=>{

    
    // try{
    //     peerConnVar = await new RTCPeerConnection(ICEServerConfig)
    // }
    



}


export const fetchUserMedia = async()=>{
  
    try{
        const localStreamVar = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
      

        // if(localStreamVar){
        //     setLocalStream(localStreamVar)
        //     largeVideoEle.srcObject = localStreamVar
        //     // smallVideoEle.srcObject = localStreamVar
        //     largeVideoEle.play()
        //     // smallVideoEle.play()
           
        // }
    }catch(err){
        console.log('fetchusermedia is not fetching usermedia. ERROR: ', err)
    }
}

export const createPeerConAndAddMediaTrack = async()=>{
    
    try{
    
    }catch(err){
        console.log(err)
    }
    


}


export const remoteStreamAndexchangeOffer = async()=>{




}