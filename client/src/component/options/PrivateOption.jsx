import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
// import { GlobalContext } from '../../context/context';
import { Box, Typography,Button } from '@mui/material';

const PrivateOption = () => {

    // const { localUser} = useContext(GlobalContext)
    const navigate = useNavigate()
    let innerHeight =0;
    useEffect(()=>{
         innerHeight = (window.innerHeight)-5;
        document.querySelector('.wrapperOption').style.height = `${innerHeight}px`;
        console.log(innerHeight)
    },[])
  

    return (<Box className='wrapperOption' style={{position: 'relative', textAlign: 'center', border: '1px solid red',  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5rem',backgroundImage: 'radial-gradient(circle, #00308F 0%, black 100%)'}}>

        

                    
            <Box  style={{width: '100%', border: '1px solid white', width: '45%', padding: '1.5rem'}}>

            <Box style={{marginBottom: '1.5rem'}}>
                <Typography variant='h5'> Chat Privately</Typography>
            </Box>


            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '0.6rem' }}>

                <Button variant='contained' onClick={()=> navigate('/createRoom')}>Create Private Room</Button>
                <Button variant='contained' onClick={()=> navigate('/enterRoom')}>Enter Private Room</Button>


                
            </Box>
            </Box>


    
        </Box>)
}

export default PrivateOption