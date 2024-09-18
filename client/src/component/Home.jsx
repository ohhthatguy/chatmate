import React from 'react'
import {  Grid2  } from '@mui/material';
import Homepage from './ChatPageMain/Homepage';
import LeftPage from './ChatSelection/LeftPage';


const Home = () => {
  return (
    <>

  
        <Grid2 container sx={{border: '2px solid brown', height: '100vh'}}>

            <Grid2 item size={3} sx={{border: '1px solid white', color: 'white', }}>       
                <LeftPage />
            </Grid2>

            <Grid2 item size='grow' sx={{border: '4px solid blue'}}>       
                <Homepage />
            </Grid2>


        </Grid2>
    


    </>
  )
}

export default Home