const UserModel = require('../models/user.model');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs');
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * 
 * @name registerUser
 * @description register a new user
 * @access public 
 * 
 */
async function registerUser(req,res) {

    const { username,email,password}=req.body;

    if(!username || !email || !password){
        return res.status(400).json({
                message:"All fields are required",
            })
    }

    const isUserAlreadyExists=await UserModel.findOne({email})

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const user=await UserModel.create({
        username,
        email,
        password:hashedPassword
    })

    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}

    )

    res.cookie("token",token);

    return res.status(201).json({
        message:"user created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        },
        token:token
    })
    
}

async function loginUser(req,res) {
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    const user=await UserModel.findOne({email})

    if(!user){
        return res.status(404).json({message:"Invalid eamil or password"})
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"})
    }

    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}

    )

    res.cookie("token",token);

    return res.status(200).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}

async function logoutUser(req,res) {
    const token=req.cookies.token


    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    return res.status(200).json({
        message:"user logged out successfully"
    })
}

async function getMeController(req,res) {
    const user=await UserModel.findById(req.user.id)

    return res.status(200).json({
        message:"user details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={
    registerUser,
    loginUser,
    logoutUser,
    getMeController
}