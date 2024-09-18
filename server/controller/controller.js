
const sendMsg = async(req,res)=>{
    //msg to all
    console.log(req.body)

}

const test = async(req,res)=>{
    //msg to all
    console.log('hi this is test')

}

module.exports = {sendMsg, test}