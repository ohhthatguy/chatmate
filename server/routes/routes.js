const express = require('express')
const router = express.Router()

const {sendMsg,test} = require('../controller/controller')

//send msg to server
router.post('/send-msg', sendMsg)

//test
router.post('/test',test)


module.exports = router

