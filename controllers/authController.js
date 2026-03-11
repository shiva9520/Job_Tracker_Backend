const User = require("../models/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userRegister = async (req, res) =>{
    try {
        const { name, email, password } = req.body;
        const useExists = await User.findOne({email});
        if (useExists) {
            res.status(400).json({message: 'User already registered'});
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password:hasedPassword
        })
        res.status(200).json({message:'User registered successfully'})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const userLogin = async (req,res) =>{
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({message: 'Invalid Credentials'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({message: "Invalid Credentials"})
        }

        const token = jwt.sign(
            { id : user._id},
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({message:"Login Sucessfully",token})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


module.exports = {
    userRegister,
    userLogin
}