import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();


export const signup = async(req,res) => {
    try{
        const {
            name,
            email,
            password,
            confirmPassword,
            role,
        } = req.body;
        console.log(req.body);
        console.log(name, email, password,confirmPassword);
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Please enter all details",
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Password and Confirm Password do not match. Please try again.",
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already exists. Please Login to continue",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const profilePhoto = `https://avatar.iran.liara.run/public/boy?username=${name}`;
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role : role ? role : "User",
            image : profilePhoto,

        });

        return res.status(200).json({
            success : true,
            user,
            message : "Account created successfully",
        })
        
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "User can't be registered now. Try after some time"
        })
    }
}


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
      console.log(email,password);
      const user = await User.findOne({email});
      console.log(user);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }
  
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )
  
        
        user.token = token
        user.password = undefined
        
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }