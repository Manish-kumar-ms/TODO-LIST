import React, { useContext, useState } from 'react'

import {  Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../../Utils';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const Login = () => {
    const[loginInfo,setloginInfo]=useState({
        email:"",
        password:""
    })

    const { userData, setUserData } = useContext(UserDataContext);

       
    const navigate=useNavigate() 

    const handleChange=(e)=>{
     const {name,value}=e.target
     setloginInfo({...loginInfo,[name] :value})
    }


     const handleLogin=async(e)=>{
        e.preventDefault()
        const {email,password}=loginInfo
        if( !email || !password){
          return handleError('name ,email and password not found')
        } 
       
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login',{
                email,
                password
            },{withCredentials:true}) 

            const {success,message,jwtToken,name}=response.data
            if(success){
                setUserData({ email, name, jwtToken });
                handleSucess(message)
                setTimeout(() => {
                    navigate('/home')
                }, 1000);
            }

        

        } catch (error) {
            console.error("Login error:", error);
            handleError(error.response?.data?.message || "Login failed");
        }
   
   }

    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white shadow-lg p-6 rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            autoFocus
            placeholder="Enter your email"
            value={loginInfo.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginInfo.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Login
        </button>
         <p className="text-sm text-gray-600 mt-4 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  Signup
                </Link>
              </p>
      </form>
      <ToastContainer />
    </div>
  </div>
  )
}

export default Login