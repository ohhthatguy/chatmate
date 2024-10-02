import React, {useEffect, useContext} from 'react'

import { io } from "socket.io-client";

import { GlobalContext } from '../../context/Context';

import Chatting from './Chatting';
import Welcome from './Welcome';



const Homepage = () => {

    const {showAI, msgRecipient,setSocket,setUserName,setActivePeople} = useContext(GlobalContext)
    // console.log(msgRecipient)

    useEffect(()=>{
        console.log("here")
       let newSocket = io.connect("http://localhost:3000") //backend is running in 3000
       setSocket(newSocket)
  
    
  // Log when the socket successfully connects
  newSocket.on("connect", () => {
      console.log('Socket connected with ID:', newSocket.id);
      setUserName(newSocket.id)
      
  });
      
  //all elements concected
  newSocket.on("AllConnectedPeople", (allConnected)=>{
  
      //all people expect me
      const temp = allConnected.filter((e)=> e!== newSocket.id)
      setActivePeople(temp)
  
  })
  

    },[])
  
  return (<>

  

    {/* // (showAI) ? <AI /> : <Chatting/> */}

    {!msgRecipient && <Welcome />}


    {msgRecipient && <Chatting />}
        
        
    
        </>)
}


export default Homepage
                    

 