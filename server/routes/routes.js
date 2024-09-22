const express = require('express')
const router = express.Router()

const {saveIndividualMessage,getIndividualMessages,deleteAllMessagesTEST} = require('../controller/controller')

//send individula msg 
router.post('/save-individual-msg', saveIndividualMessage)

//fetch messages individula
router.get('/get-individual-msgs', getIndividualMessages)

//delete
router.delete('/delete',deleteAllMessagesTEST )






module.exports = router

