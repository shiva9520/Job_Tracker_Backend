const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({message: "token not generated"})
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        req.user = user
        next();

    } catch (error) {
        res.status(401).json({message: 'Invalid Token'})
    }
}

module.exports = authMiddleware