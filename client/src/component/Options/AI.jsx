import React,{useState} from 'react'
import { TextareaAutosize, Box, Grid2, Avatar, CardHeader,Badge  } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

const AI = () => {


    const [recieveMsg,setRecieveMsg] = useState([])
    const [userMsg, setUserMsg] = useState('')

    const handleClick = async(e)=>{
        console.log('AI, ', e)
        setRecieveMsg(prev=> [...prev,{userMsg: userMsg}])
        setUserMsg('')

        try{

          console.log("baki xa")

        }catch(err){
            console.log(err)
        }


        

     
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

        <CardHeader sx={{'.MuiCardHeader-subheader': {color: 'white'}}} title='AI' subheader='welcome mortal!' />  

    </Grid2>
    
    {/* msg seen area */}



           <Grid2 item sx={{height: '80vh',border: '2px solid white', display: 'flex',flexDirection: 'column' ,width: '100%', color: 'white'}}>

                   <Box style={{display: 'flex', border: '3px solid green', height: '100%',  flexDirection: 'column', width: '100%',overflowY: 'scroll'  }}>
                 
                       {
                           recieveMsg && recieveMsg.map((e, index)=>(

                               (typeof e !== 'object' ) ?

                               //other side
                               
                               <Box style={{minWidth: '12px',margin: '30px 0px 30px 0px', position: 'relative',  maxWidth: '50%', border: '1px solid white', borderRadius: '10px', wordBreak: 'break-all',}}>
                                 
                                 <Box style={{
                                               background: '#2F2F2F',
                                               padding: '10px', fontSize: '1.25rem', borderRadius: '10px' , 
                                               wordBreak: 'break-all'}} >  {e}
                                               
                                           </Box>
                               </Box>
                            
                            
                               :  
                                   //user side is object
                               <Box sx={{margin: '30px 0px 30px 0px',     display:'flex', justifyContent: 'end',}}>

                                       <Box sx={{minWidth: '12px', width: '50%', border: '1px solid white', borderRadius: '10px'}}>

                                           <Box style={{
                                               background: '#2F2F2F',
                                               padding: '10px', fontSize: '1.25rem', borderRadius: '10px' , 
                                               wordBreak: 'break-all'}} >   {e.userMsg}
                                               
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
                       placeholder="question AI HERE"
               />

         
                   <IconButton onClick={()=> handleClick()} sx={{ left: '96%', position: 'absolute', top: '5%'}} color="inherit" >
                       <SendIcon />
                   </IconButton>
       

           </Grid2>
       
       



        <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    
        </Box>
    </>
  )
}

export default AI