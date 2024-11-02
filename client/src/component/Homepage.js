import React, {useState, useEffect, useContext,useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import { TextField, Box, Typography, Chip, Grid2, Avatar,Button, Dialog,DialogContent,DialogTitle, DialogContentText, DialogActions } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { GlobalContext } from '../context/context';
import { io } from "socket.io-client";



const Homepage = () => {

    const {setSocket, socket, setLocalUser, localUser, onlyRunOnce} = useContext(GlobalContext)
    const inputRef = useRef(null)
    const navigate = useNavigate()


    const setName =()=>{
        console.log(inputRef.current.value)
        if(inputRef.current.value.length >0 ){
            setLocalUser(prev=> ({...prev, name: inputRef.current.value}))
            navigate('/Options')

        }

    }
    
    
    useEffect(()=>{

            if(onlyRunOnce.current){

                let newSocket = io.connect("http://localhost:3000") //backend is running in 3001
                setSocket(newSocket)

                // Log when the socket successfully connects
                newSocket.on("connect", () => {
                    console.log('Socket connected with ID:', newSocket.id);
                    setLocalUser(prev => ({...prev, id: newSocket.id}))
                    
                });  
                    
                    onlyRunOnce.current = false
            }

            return () => {
                if (socket) {
                  socket.disconnect(); // Properly clean up
                }
            }

            

    },[])


    // console.log(localUser)
    // console.log(socket)

  return (<Box style={{position: 'realtive'}}>

        <Box style={{border: '1px solid white', position: 'absolute', top: '30%', left: '25%', width: '50%', padding: '0.5rem'}}>

           <Box style={{textAlign: 'center', padding: '1rem'}}> 

              <Typography variant='h5'>  Welcome to ChatMate </Typography>
            
             </Box>

            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem'}}>

                <TextField inputRef={inputRef} variant='outlined' label='Enter UserName' style={{width: '60%'}} />
                <SendIcon onClick={()=>setName()} fontSize='large'/>
                

            </Box>
        </Box>


    
        </Box>)


}


export default Homepage
                    

 