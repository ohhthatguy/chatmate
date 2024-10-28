import {createContext, useState, useRef} from 'react'
import { io } from "socket.io-client";

//creating context
export const GlobalContext = createContext();

//creating context provider
export const GlobalProvider = ({children}) =>{

    const [localUser, setLocalUser] = useState({
        name: '',
        id: '',
        creator: '',//bool value
        roomID: ''
    }) //only one local user

    const [remoteUser, setRemoteUser] = useState([]) //multiple remote user 

    const [message, setMessage] = useState([{ message: 'waiting for People to join...', sender: 'System', senderId: '', roomId: '', isNotification: true}])

    const [socket, setSocket] = useState()

    const onlyRunOnce = useRef(true); //for the production of socket in client side only once

    const [room, setRoom] = useState({
        roomID: '',
        roomCreaterName: '',
        roomCreaterID: ''
      });

    const [showModal, setShowModal] = useState(true)

    const [openVidCallSelectionModal, setOpenVidCallSelectionModal] = useState(false)

    const [refreshList, setRefreshList] = useState(false)






    return (<GlobalContext.Provider value={{localUser,message,room,setRoom, showModal, setShowModal,setMessage, setLocalUser, remoteUser,onlyRunOnce,setRemoteUser, socket, setSocket,openVidCallSelectionModal, setOpenVidCallSelectionModal, refreshList, setRefreshList}} >

        {children}

    </GlobalContext.Provider>)
}