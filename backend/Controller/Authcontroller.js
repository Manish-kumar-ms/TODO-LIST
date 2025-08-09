import express from 'express';
import UserModel from '../Models/UserModel.js';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { emitSocketEvent } from '../socket.js';




export const signup = async(req, res) => {
   try {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({email})

    if(user) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword
    })

   
   emitSocketEvent('newUser', newUser);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        email,
        name
    });
    
   } catch (error) {
       console.error(error);
       res.status(500).json({
           success: false,
           message: "there is some problem on registration"
           
       });
   }
}


export const login=async(req, res) => {
    try {
          const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });

    if(!user) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        });
    }
    const isequal=await bcrypt.compare(password, user.password);

    if(!isequal) {
        return res.status(400).json({
            success: false,
            message: "password is incorrect"
        });
    }

    const jwtToken = jwt.sign(
         {name:user.name, _id:user._id},
            process.env.JWT_SECRET,
            {expiresIn :'24h'}
    )

      res.cookie("token", jwtToken, {
            httpOnly: true,
            maxAge: 7*24 * 60 * 60 * 1000, // 7 day
            sameSite: "None",
            secure: true,  // Set to true if using HTTPS 
     })

    res.status(200).json({
        success: true,
        message: "User logged in successfully", 
        jwtToken,
        email,
        name:user.name
    });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "There is some problem on login"
        });
        
    }
  
}

export const logout = (req, res) => {
    try {
         res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "There is some problem on logout"
        });
    }
}


export const getallUsers = async (req, res) => {
    try {
        const users=await UserModel.find(); // Fetch only name and email fields
        return res.status(200).json({
            success: true,
            users
        }); 
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Problem while fetching users"
        });
        
    }
}


export const currentUser = async (req, res) => {
    try {

        const user = await UserModel.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Problem while fetching current user"
        });
        
    }
}
