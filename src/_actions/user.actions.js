import { userService } from '../_services'


export const userActions = {
    login,
    logout
};
function login(data){
     debugger;
    return dispatch => {
       let apiEndpoint = 'authenticate';
       let payload = {
           email: data.email,
           password: data.password
       }
       userService.loginService("/signin", payload)
       .then((response)=>{
           console.log(response);
           if (response !=null && response !=undefined && response !=""){
            console.log(response.data);
           if (response.data.token) {
             localStorage.setItem('token', response.data.token);
             localStorage.setItem('auth', true);
             localStorage.setItem('userId', response.data.userId);
             localStorage.setItem('companyId',1);
             dispatch(setUserDetails(response.data));
            //  alert("Login Success");
           
           }
           else{
               alert("Couldn't generate token")
           }
        }else{
            alert("Unauthorised");
          
        }
       })
    };
}
function logout(){
    return dispatch => {
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
        dispatch(logoutUser());
        alert("Logout Sucessfull ! ");
      //  history.push('/');
    }
}
export function setUserDetails(data){
     
      return{
          type: "LOGIN_SUCCESS",
          auth: true,
          token: data.token
      }
}
export function logoutUser(){
      return{
          type: "LOGOUT_SUCCESS",
          auth: false,
          token: ''
      }
}