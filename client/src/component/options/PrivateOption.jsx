import React,{useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from '../../context/context';
import { Box, Typography,Button } from '@mui/material';

const PrivateOption = () => {

    const { localUser} = useContext(GlobalContext)
    const navigate = useNavigate()

    return (<Box style={{position: 'realtive'}}>

        <Box style={{border: '1px solid white', position: 'absolute', top: '30%', left: '25%', width: '50%', padding: '0.5rem'}}>

           <Box style={{textAlign: 'center', padding: '1rem'}}> 

              <Typography variant='h5'>{ `Chat Privately ` }</Typography>
            
             </Box>

            <Box style={{ display: 'grid', placeItems: 'center', gap: '0.6rem'}}>

                <Button variant='contained' onClick={()=> navigate('/createRoom')}>Create Private Room</Button>
                <Button variant='contained' onClick={()=> navigate('/enterRoom')}>Enter Private Room</Button>


            </Box>
        </Box>


    
        </Box>)
}

export default PrivateOption