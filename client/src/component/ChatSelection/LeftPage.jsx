import React, { useState, useContext } from 'react'
import { Grid2, Box, Table,  TextField, TableHead, TableBody, TableRow, TableCell, CardHeader, Avatar, createTheme, ThemeProvider, Button } from '@mui/material'
import { GlobalContext } from '../../context/Context'
import { API } from '../../API/API'

const LeftPage = () => {

    const [forSearch, setForSearch] = useState([])
    const {setShowAI, activePeople, theUser,socket,msgRecipient,userName, setMsgRecieveNotif, msgRecieveNotif,  setMsgRecipient} = useContext(GlobalContext)
   
    // console.log(activePeople)
   

    const theme = createTheme({
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                // Outlined
              
                "& .MuiOutlinedInput-root": {
                  
                  fontFamily: "Arial",
                  height: '30px',
             
                  border: '1px solid white',
                  color: 'white',
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#wheat",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: '0px solid white',
                      
                    },
                  },
                  "&:hover:not(.Mui-focused)": {
                    "& .MuiOutlinedInput-notchedOutline": {
                    //   borderColor: "white",
                    },
                  },
                },
                "& .MuiInputLabel-outlined": {
                //   color: "#2e2e2e",
                  fontWeight: "bold",
                  color: 'white',
               
                  "&.Mui-helperText": {
                    color: "white",
                  },
                },
                
                
               
              },
            },
          },
        },
      });

    const handleSearch = (e)=>{

        setForSearch((activePeople.filter((element)=>  {
            if (element.name.toLowerCase().includes(e.toLowerCase()))
                return element.name
      })))

    }

    const handleDelete = async()=>{
      try{
            
            await API.deleteAllMessagesTEST()
            console.log('succesfully deleted')

      }catch(err){
        console.log(err)
      }

    }

    // console.log(msgRecieveNotif)

    const handleClick = (e)=>{
        // console.log(e)

     
          setMsgRecipient(e)

        


        // socket.emit("send-direct-message", e, recieveMsg)


        
            // socket.on("mymessage", (message)=>{
            //     console.log(message)
            // })
    }
    // console.log(msgRecipient)



    


    //   console.log(forSearch)


  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
        
        <Grid2 item sx={{height: '30vh', border: '1px solid white'}}>

            {/* current user */}
            <Box sx={{display: 'flex'}}>
                <Avatar src={theUser.photo} alt={theUser.name} />
                <CardHeader title={userName} subheader='Active Now'  sx={{ padding: '0px 0px 0px 5px', '.MuiCardHeader-subheader': {color: 'white', fontSize: '70%'}, '.MuiCardHeader-title': {color: 'white', fontSize: '80%'}}} />
            </Box>

            {/* search for users */}
                <Box>
                {/* style={{border: '1px solid wheat', height: '20px', }} */}
                {/* <ThemeProvider theme={theme}>
                     <TextField helperText='hi' onChange={(e)=> handleSearch(e.target.value)} variant="outlined" color="secondary" />
                </ThemeProvider> */}
                </Box>

            {/* options */}
            <Box sx={{display: 'flex',justifyContent: 'space-evenly', fontSize: '80%'}}>


            <Box sx={{display: 'grid', placeItems: 'center'}}>
                    <Button onClick={()=> handleDelete()}>DELETE</Button>
                </Box>

                <Box sx={{display: 'grid', placeItems: 'center'}}>
                    <Avatar src={theUser.photo} alt={theUser.name} />
                    Friend Requests
                </Box>

                <Box sx={{display: 'grid', placeItems: 'center'}}>
                    <Avatar src={theUser.photo} alt={theUser.name} />
                    Group Chat
                </Box>

                <Box onClick={()=>setShowAI(prev=>!prev)} sx={{display: 'grid', placeItems: 'center', border: '1px solid white', ':active':{transform: 'scale(1.1)'}}}>
                    <Avatar src={theUser.photo} alt={theUser.name} />
                    AI 
                </Box>
            </Box>

        </Grid2>

        {/* all the people are here */}
        <Grid2 item sx={{ border: '1px solid white', height: '69vh', overflowY: 'scroll'}}>

            <Table >

                {/* <TableHead>
                    <TableCell sx={{color:'white', textAlign: 'center'}}>
                        AI
                    </TableCell>
                </TableHead> */}
                <TableBody>
                    <TableCell sx={{color:'white'}}>
                    <ThemeProvider theme={theme}>
                     <TextField helperText='hi' onChange={(e)=> handleSearch(e.target.value)} variant="outlined" color="secondary" />
                </ThemeProvider>
                    </TableCell>
                </TableBody>

                <TableHead>
                    <TableCell sx={{color:'white', textAlign: 'center'}}>
                        Chat
                    </TableCell>
                </TableHead>

                <TableBody>

                    {
                        (forSearch.length == 0) ? activePeople.map((e)=>(

                          
                            <TableRow>

                            <TableCell onClick={(e)=>handleClick(e.target.innerText)} sx={{color:'white'}}>

                                {e?.name}
       
                            </TableCell>

                            </TableRow>
                        
                        
                        
                          

                        )) : forSearch.map((e)=>(
                            <TableRow>
                            <TableCell onClick={(e)=>handleClick(e.target.innerText)} sx={{color:'white', boxShadow: ' 0 10px 15px rgba(12, 12, 12, 0.5), 0 4px 6px rgba(255, 255, 255, 0.1)'}}>

                                {e.name}
                            
                                        
                            </TableCell>
                            </TableRow>
                        ))
                      
                    }
              
                </TableBody>

            </Table>




        </Grid2>


        
    </Box>
  )
}

export default LeftPage