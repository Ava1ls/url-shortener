const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const secret = 'tmbck11uX'

exports.protect = asyncHandler(async(req, res, next)=>{

    let token = req.headers.authorization.split(' ').slice(1).toString('base64')
    //let token = req.cookie.split('=').slice(1).toString('base64')
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ 
        console.log(token);
    } else if(req.cookies.token){
        token = req.cookies.token
        console.log(`Token from cookie ${token}`);
    }

    if(!token){
        return next(new ErrorResponse('Not authorize to acces this route', 401))
    }

    try {
        const decoded = jwt.verify(token, secret)
        console.log(decoded);
        req.user = await User.findById(decoded.id)    
    } catch (error) {
        console.log(error);
         return next(new ErrorResponse('Not authorize to acces this route', 401))
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