const mongoose = require('mongoose')

const database = async(DB_URL)=>{
    try{
        await mongoose.connect(DB_URL)
        console.log('sucessfully connected to db')
    }catch(err){
        console.log('not connected to db. ERROR: ', err)
    }
}

module.exports = database