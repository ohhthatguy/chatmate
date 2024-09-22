import axios from 'axios'

const API_URl = {
    saveIndividualMessage: {method: 'post', url: '/save-individual-msg'},
    getIndividualMessages: {method: 'get', url: '/get-individual-msgs'},
    deleteAllMessagesTEST: {method: 'delete', url: '/delete'} 

   
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000', //serevr that is handling routes is running to 4000 port
    timeout: 10000
})

const API = {}

for(const [key,value] of Object.entries(API_URl) ){

    API[key] = (data)=>{


        return axiosInstance({ 
            method: value.method,
            url: value.url,
            data: value.method=='get' ? {}: data,
            params: value.method=='get' ? data : {}
        })
    }

}

export {API}