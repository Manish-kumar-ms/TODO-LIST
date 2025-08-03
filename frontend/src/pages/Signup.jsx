import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSucess } from '../../Utils.js'

const Signup = () => {
    const [signupInfo,setsignInfo]=useState({
        name :"",
        email :"",
        password:"",
    })

    const navigate=useNavigate()

   const handleChange=(e)=>{
    const {name,value}=e.target
    setsignInfo({...signupInfo,[name]:value})
   }

   const handleSignup=async(e)=>{
    e.preventDefault();
      const {name,email,password}=signupInfo
      if(!name || !email || !password){
        return handleError('name ,email and password not found')
      }

      try {
        const response = await axios.post('http://localhost:8000/api/auth/signup',{
            name,
            email,
            password
        },{withCredentials:true})

        const {success,message}=response.data
        console.log(response.data)
        if(success){
            handleSucess(message)
            navigate('/login')
        }

      } catch (error) {
        handleError(error)
      }
   }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white shadow-lg p-6 rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={signupInfo.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={signupInfo.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={signupInfo.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Signup
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>

      <ToastContainer />
    </div>
  </div>
  )
}

export default Signup