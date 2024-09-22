import React, {useState, useEffect, useContext} from 'react'
import { TextareaAutosize, Box, Grid2, Avatar, CardHeader,Badge  } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
// import { io } from "socket.io-client";
import { GlobalContext } from '../../context/Context';
import { API } from '../../API/API';



const Chatting = () => {

const [userMsg, setUserMsg] = useState('')
const [data,setData]=useState({})


const {setMsgRecieveNotif,userName, socket,message, setMessage,msgRecipient} = useContext(GlobalContext)

// console.log(recieveMsg)

//open this to make conenction to backend for socketio
// let newSocket

useEffect(()=>{

//recieve message
    socket.on("mymessage", (message, senderID,recieverID)=>{
        console.log(`message: ${message} from ${senderID} to ${recieverID}`)
        console.log("here")
        // setID({senderID: senderID, recieverID: recieverID})
        setData({message: message, sender: senderID, reciever: recieverID})
        setMessage(prev => [...prev, {message: message, sender: senderID, reciever: recieverID}])
    })

        return ()=>{
            socket.disconnect()
        }

},[])


//senderID: userName
//recievreID: msgRecicpient

//this is to save data everytime message state is altered
useEffect(()=>{

   const saveIndividualMessages = async()=>{

        try{
             await API.saveIndividualMessage({data})
            console.log('successfully saved indiviual message')

        }catch(err){

            console.log('ERROR: ', err)
        }

   }



   if(Object.keys(data).length > 0){
   
//    console.log(data)

        saveIndividualMessages()
   }

},[data])


// //this is to get saved messages just for the first time
useEffect(()=>{
    
    const getIndividualMessages = async()=>{

        try{
            //get recieved message i.e. sender is reveicer  i.e. we are reciievr i.e. the one that is using the screen is reciever
            const res = await API.getIndividualMessages({reciever: userName, sender: msgRecipient})
            console.log(res.data)
            setMessage(res.data)
            
            console.log('successfully fetched indiviual message')

        }catch(err){

            console.log('ERROR: ', err)
        }

   }

  
        if(userName && msgRecipient){
            getIndividualMessages()

        } 
    


    
},[])

// console.log(message)
// console.log('userName: ', userName)
// console.log('reciver: ', msgRecipient)

const handleClick = ()=>{

//open this to make conenction to backend for socketio
setData({message: userMsg, sender: userName, reciever: msgRecipient})
setMessage( prev => [ ...prev, {message: userMsg, sender: userName, reciever: msgRecipient}])

  socket.emit('send-direct-message', userName,msgRecipient,userMsg)

    setUserMsg('')

 
}

const tempPic = 'https://cdn.pixabay.com/photo/2024/01/25/10/50/mosque-8531576_960_720.jpg'
  return (
    <>
    
    <Box>

{/* heading of the chat */}

<Grid2 item sx={{height: '10vh',border: '1px solid pink', color: 'white', display: 'flex'}}>
    
  

        <Badge  overlap="circular" variant='dot' sx={{'& .MuiBadge-badge': {backgroundColor: '#44b700', color: '#44b700'}}} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>

                <Avatar alt="temp pic" src={tempPic} sx={{width: 56, height: 56}}/>


        </Badge>

    <CardHeader sx={{'.MuiCardHeader-subheader': {color: 'white'}}} title={msgRecipient} subheader='ccc' />  

</Grid2>

{/* msg seen area */}



       <Grid2 item sx={{height: '80vh',border: '2px solid white', display: 'flex',flexDirection: 'column' ,width: '100%', color: 'white'}}>

               <Box style={{display: 'flex', border: '3px solid green', height: '100%',  flexDirection: 'column', width: '100%',overflowY: 'scroll'  }}>
             
                   {
                       message && message.map((e, index)=>(
//e.type == 'recieved-msg' &&
                           (  e.sender == msgRecipient && e.reciever == userName ) ?

                           //other side
                           
                           <Box key={index} style={{minWidth: '12px',margin: '30px 0px 30px 0px', position: 'relative',  maxWidth: '50%', border: '1px solid white', borderRadius: '10px', wordBreak: 'break-all',}}>
                             
                             <Box style={{
                                           background: '#2F2F2F',
                                           padding: '10px', fontSize: '1.25rem', borderRadius: '10px' , 
                                           wordBreak: 'break-all'}} >  {e.message}
                                           
                                       </Box>
                           </Box>
                        
                        //e.type == 'sent-msg' &&
                           :  (  e.sender == userName && e.reciever == msgRecipient ) &&   
                               //user side 
                           <Box sx={{margin: '30px 0px 30px 0px',     display:'flex', justifyContent: 'end',}}>

                                   <Box sx={{minWidth: '12px', width: '50%', border: '1px solid white', borderRadius: '10px'}}>

                                       <Box style={{
                                           background: '#2F2F2F',
                                           padding: '10px', fontSize: '1.25rem', borderRadius: '10px' , 
                                           wordBreak: 'break-all'}} >   
                                           
                                           {e.message}
                                           
                                       </Box>


                                   </Box>

                               </Box>

                       ))
                   }

             
               </Box>

       </Grid2>




{/* typing area */}
     
       <Grid2 item sx={{ border: '1px solid white', color: 'white', position: 'relative' }}>

           <TextareaAutosize  value={userMsg} onChange={(e)=> setUserMsg(e.target.value)}
                   style={{ fontSize: '1.2rem', border: '1px solid white',  width: '100%', padding: '10px 30px 10px 10px', fontFamily: 'sans-serif', background: '#2F2F2F', color: 'white', resize: 'none', borderRadius: '10px' }}
                   placeholder="enter question here"
           />

     
               <IconButton onClick={()=> handleClick()} sx={{ left: '96%', position: 'absolute', top: '5%'}} color="inherit" >
                   <SendIcon />
               </IconButton>
   

       </Grid2>
   
   


    </Box>
    
    </>
  )
}

export default Chatting