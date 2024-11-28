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
    let isDarkMode = true;
    let innerHeight = 0;


    const setName =()=>{
        console.log(inputRef.current.value)
        if(inputRef.current.value.length >0 ){
            setLocalUser(prev=> ({...prev, name: inputRef.current.value}))
            navigate('/privateOptions')

        }

    }
    
    
    useEffect(()=>{
        innerHeight = (window.innerHeight);
        document.querySelector('.wrappeHome').style.height = `${innerHeight}px`;
        console.log(innerHeight)

            if(onlyRunOnce.current){

                let newSocket = io.connect("https://192.168.18.76:3000") //backend is running in 3000
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



  return (<Box className='wrappeHome' style={{position: 'relative', textAlign: 'center',display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5rem',backgroundImage: 'radial-gradient(circle, #00308F 0%, black 100%)'}}>

        

        <Box > 
            <Typography variant='h3' sx={{fontFamily: '"Oswald", sans-serif'}}>  Welcome to ChatMate! </Typography>
        </Box>

            <Box  style={{width: '100%'}}>

                <Box style={{marginBottom: '1.5rem'}}>
                    <Typography variant='h5'> Get Started  </Typography>
                </Box>


            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', }}>


                <TextField inputRef={inputRef} variant='outlined' label='Enter UserName'   sx={{
                    width: '70%',
                        input: {
                            color: isDarkMode ? 'white' : 'black',
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'gray' : 'black',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? 'white' : 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                        },
                    }} />
                <SendIcon onClick={()=>setName()} fontSize='large'/>

            </Box>


        </Box>

        

       


    
        </Box>)


}


export default Homepage
                    

 