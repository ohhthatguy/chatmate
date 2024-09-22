const mongoose = require('mongoose')
const messageSchema = mongoose.Schema({
    sender:{
        type: String,
        required: true
    },
    reciever:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
  
})


// // Define a parent schema that holds an array of messages
// const messageSchema = new mongoose.Schema({
//     messages: {
//       type: [singleMessageSchema], // Array of messageSchema
//       required: true,
//       default: [] // Default to an empty array
//     }
//   }, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const messageModel = mongoose.model('individual-message-record', messageSchema)
module.exports = messageModel