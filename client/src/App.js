import React from 'react'
import Home from './component/Home';
import { Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/Context';




const App = () => {
  return (
  <>
  <GlobalProvider>
  <Routes>
    
      <Route path='/' element={<Home />} />
        
    </Routes>
    </GlobalProvider>

    </>
    )
}

export default App