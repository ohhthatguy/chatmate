const messageModel = require('../model/messageModel')


const saveIndividualMessage = async(req,res)=>{
    
    try{
        let message = new messageModel(req.body.data)
        await message.save()
        return res.status(200).json({msg: 'message save sucesfully'})

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }

}

const getIndividualMessages = async(req,res)=>{



    try{

       
        // console.log(req.query)
        const {reciever, sender} = req.query;

        const output = await messageModel.find({reciever, sender})

        if (output.length === 0) {
            return res.status(404).json({ message: 'No messages found' });
          }
          
          console.log(output)
          // Respond with the found messages
          return res.status(200).json(output);
       
    
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}

const deleteAllMessagesTEST = async(req,res)=>{
    try{

        await messageModel.deleteMany({})
        return res.status(200).json("all data removed from individual-message-record")

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}


module.exports = {saveIndividualMessage, getIndividualMessages,deleteAllMessagesTEST}