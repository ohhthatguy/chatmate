import {createContext, useState} from 'react'

//creating context
export const GlobalContext = createContext();

//creating context provider
export const GlobalProvider = ({children}) =>{

    const [showAI, setShowAI] = useState(false)
    const [socket,setSocket] = useState()
    const [message, setMessage] = useState([])
    const [msgRecipient, setMsgRecipient] = useState()
    const [userName, setUserName] = useState('')
    const [msgRecieveNotif, setMsgRecieveNotif] = useState([])


    const [activePeople,setActivePeople] = useState([])

    

    const [theUser,setTheUser] = useState({
        name: 'Bhaskar Thakulla',
        photo: 'https://media.istockphoto.com/id/1022174454/photo/portrait-of-smiling-handsome-man-in-white-t-shirt-standing-with-crossed-arms-isolated-on-gray.jpg?s=1024x1024&w=is&k=20&c=D2St35Y1evG2cbjXSNb9Pa77_Ae8giaB00P18xrW-aI='
    })


    return (<GlobalContext.Provider value={{showAI,setMsgRecieveNotif, msgRecieveNotif,setMsgRecipient,setUserName,userName,msgRecipient,setMessage,message,setShowAI,socket,setSocket,activePeople,setActivePeople,theUser}}>

        {children}

    </GlobalContext.Provider>)
}



