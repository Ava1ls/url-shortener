const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const secret = 'tmbck11uX'

exports.protect = asyncHandler(async(req, res, next)=>{

     
    //let token = req.cookie.split('=').slice(1).toString('base64')
    let token
    /*if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { 
        token = req.headers.authorization.split(' ').slice(1).toString('base64')
        console.log(`Token from bearer ${token}`);
    } else */
    if(req.cookie.token){
        token = req.cookie.token
        console.log(`Token from cookie ${token}`);
    }

    if (!token) {
        return next(new ErrorResponse('Not authorize to acces this route', 401))
    }

    try {
        const decoded = jwt.verify(token, secret)
        req.user = await User.findById(decoded.id)    
    } catch (error) {

        //return next(new ErrorResponse('Not authorize to acces this route or smthng went wrong', 401))
        console.log(error);
    }
})
