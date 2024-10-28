import React,{useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from '../../context/context';
import { Box, Typography,Button } from '@mui/material';



const Options = () => {

    const { localUser} = useContext(GlobalContext)
    const navigate = useNavigate()
    // console.log(localUser)

    return (<Box style={{position: 'realtive'}}>

        <Box style={{border: '1px solid white', position: 'absolute', top: '30%', left: '25%', width: '50%', padding: '0.5rem'}}>

           <Box style={{textAlign: 'center', padding: '1rem'}}> 

              <Typography variant='h5'>{ `${localUser.name}, how would you like to Chat ?` }</Typography>
            
             </Box>

            <Box style={{ display: 'grid', placeItems: 'center', gap: '0.6rem'}}>

                <Button variant='contained' onClick={()=> navigate('/publicOptions')}>Random People</Button>
                <Button variant='contained' onClick={()=> navigate('/privateOptions')}>Chat Privately</Button>


            </Box>
        </Box>


    
        </Box>)
}

export default Options