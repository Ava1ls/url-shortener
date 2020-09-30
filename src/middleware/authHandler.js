const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

exports.protect = asyncHandler(async(req, res, next)=>{
    let token 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ 
        token = req.headers.authorization.split(' ').slice(1).toString()
        console.log(token);
    } else if(req.cookies.token){
        token = req.cookies.token
        console.log(`Token from cookie ${token}`);
    }

    if(!token){
        return next(new ErrorResponse('Not authorize to acces this route', 401))
    }

    try {
        const decoded = jwt.verify(token, procces.env.JWT_SECRET)
        console.log(decoded);

        req.user = await User.findById(decoded.id)

        return next(new ErrorResponse('Not authorize to acces this route', 401))
    } catch (error) {
        
    }
})

//Grant acces to specific routes
exports.authorize = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
        }
        next()
    }
}