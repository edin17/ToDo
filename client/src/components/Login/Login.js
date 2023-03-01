import { useState } from "react"
import axios from "axios"


export default function Login(){
    let [userData, setUserData] = useState({
        username:"",
        password:""
    })

    function login(){
        axios.post("/login",userData)
        .then(res=>{
            if(res.data.loged_in === true){
                localStorage.setItem("token",res.data.token)
                window.location="/"
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return <>
        <h1>Login</h1>
        <div id = "form">
            
            <label htmlFor="username">Username</label>
            <input className="cred" id="username" type="text" value={userData.username} onChange={e=>setUserData({...userData,username:e.target.value})}/>

            <label htmlFor="password">Password</label>
            <input className="cred" id="password" type="password" value={userData.password} onChange={e=>setUserData({...userData,password:e.target.value})}/>

            <button className="auth-btn" onClick={()=>login()}>Login</button>
        </div>
    </>
}