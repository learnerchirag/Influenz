import axios from 'axios';
import config from '../config/config';

export const userService = {
    get,
    post,
    put,
    deleteDetail,postWithFile,loginService
};
// log in 
function loginService(apiEndpoint, payload){
     
    return axios.post(config.loginUrl+apiEndpoint, payload)
    .then((response)=>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}
function get(apiEndpoint,userId){
     
    console.log(apiEndpoint);
  return axios.get(config.baseUrl+apiEndpoint, getOptions())
   //return axios.get(apiEndpoint, getOptions())
    .then((response)=>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}
 function post(apiEndpoint, payload){
     
    return  axios.post(config.baseUrl+apiEndpoint, payload, getOptions())
    .then((response)=>{
        console.log(response);
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}
function put(apiEndpoint, payload){
    return axios.put(config.baseUrl+apiEndpoint, payload, getOptions())
    .then((response)=>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}
function deleteDetail(apiEndpoint){
    return axios.delete(config.baseUrl+apiEndpoint, getOptions())
    .then((response)=>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}
function getOptions(){
     
   // alert()
    let options = {};
    if(localStorage.getItem('token')){
        options.headers = {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            // 'Content-Type': 'multipart/form-data'
        };
    }
    return options;
}

//function for file uploading
function postWithFile(apiEndpoint, payload){
    debugger
    var response=axios({
        method: 'post',
        url: config.baseUrl+apiEndpoint,
        data: payload,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
             }
        })
        .then(function (response) {
            //handle success
             
            return response
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        return response
}