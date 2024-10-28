import React from 'react'
import { Route,Routes } from 'react-router-dom'

import Homepage from './component/Homepage'
import Options from './component/options/Options'
import PrivateOption from './component/options/PrivateOption'
import PublicOption from './component/options/PublicOption'
import Room from './component/options/Room'
import CreateRoom from './component/options/Private/CreateRoom'
import EnterRoom from './component/options/Private/EnterRoom'
import VideoCall from './component/options/VideoCall/VideoCall'



const App = () => {
  return (
  <div>

    <Routes>

     
     <Route path='/' element={<Homepage />} />
     <Route path='/Options' element={<Options />} />
     <Route path='/privateOptions' element={<PrivateOption />} />
     <Route path='/publicOptions' element={<PublicOption />} />

     <Route path='/enterRoom' element={<EnterRoom />} />
     <Route path='/createRoom' element={<CreateRoom />} />

     <Route path='/videocall' element={<VideoCall />} />


     



     </Routes>
    </div>
    )
}

export default App