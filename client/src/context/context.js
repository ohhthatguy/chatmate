import {createContext, useState, useRef} from 'react'

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
    const [incomingCallModal, setIncomingCallModal] = useState(false)
    const [showCallEndedText, setShowCallEndedText] = useState('')

    


    const [refreshList, setRefreshList] = useState(false)


    ///////
    const ICEServerConfig = {
        iceServers:[
            {
                urls:[
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302'
                ]
            }
        ]
    }

    const [localStream, setLocalStream] = useState('')
    const [remoteStream, setRemoteStream] = useState('')




    return (<GlobalContext.Provider value={{localUser,message,room,setRoom, showModal, setShowModal,setMessage, setLocalUser, remoteUser,onlyRunOnce,setRemoteUser, socket, setSocket,openVidCallSelectionModal, setOpenVidCallSelectionModal, refreshList, setRefreshList,ICEServerConfig,incomingCallModal, setIncomingCallModal,showCallEndedText, setShowCallEndedText,localStream, setLocalStream,remoteStream, setRemoteStream}} >

        {children}

    </GlobalContext.Provider>)
}