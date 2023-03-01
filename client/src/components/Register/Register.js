import { useState } from "react"
import axios from "axios"


export default function Register(){
    let [userData, setUserData] = useState({
        username:"",
        password:"",
        confirm:""
    })
    function register(){
        axios.post("/register",userData)
        .then(res=>{
            if(res.data.error){
                window.location="/register"
            }else{
                window.location = "/login"
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return <>
        <h1>Register</h1>
        <div id = "form">
            
            <label htmlFor="username">Username</label>
            <input className="cred" id="username" type="text" value={userData.username} onChange={e=>setUserData({...userData,username:e.target.value})}/>

            <label htmlFor="password">Password</label>
            <input className="cred" id="password" type="password" value={userData.password} onChange={e=>setUserData({...userData,password:e.target.value})}/>

            <label htmlFor="confirm">Confirm password</label>
            <input className="cred" id="confirm" type="password" value={userData.confirm} onChange={e=>setUserData({...userData,confirm:e.target.value})}/>
            <button className="auth-btn" onClick={()=>register()}>Register</button>
        </div>
    </>
}