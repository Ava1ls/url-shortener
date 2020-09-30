const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const AsyncHandler = require('../middleware/asyncHandler')
const ErrorHandler = require('../middleware/errorHandler')
const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')

// @desc        Register new user
// @route       POST /auth/register
// @access      Public
exports.register = AsyncHandler(async(req, res, next)=>{
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 201, res)

    res
        .status(201)
        .json({success: true})
        .token
})

// @desc        Log in to existing user account
// @route       POST /auth/login
// @access      Public
exports.login = AsyncHandler(async(req, res, next)=>{
    const {email, password} = req.body

    if(!email || !password){
        return next(new ErrorResponse(`Please provide email and password`, 400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    sendTokenResponse(user, 200, res)

    res
        .status(201)
        .json({success: true}.token)
        
})


// @desc        Get current logged user
// @route       GET /auth/me
// @access      Private (token)
exports.getMe = AsyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user.id)

    res
        .status(201)
        .json({
            success: true,
            data: user
        })
        
})


// @desc        Update current logged user details
// @route       PUT /auth/updatedetails
// @access      Private (token)
exports.updateDetails = AsyncHandler(async(req, res, next)=>{
    
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate,{
        new: true,
        runValidators: true
    })

    res
        .status(201)
        .json({
            success: true,
            data: user
        })
})


// @desc        Update current logged user password
// @route       PUT /auth/updatepassword
// @access      Private (token)
exports.updatePassword = AsyncHandler(async(req, res, next)=>{
       
    const user = (await User.findById(req.user.id)).select('+password')

    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password is incorrcet`, 401))
    }

    user.password = req.body.newPassword

    await user.save
    
    sendTokenResponse(user, 200, res)
    
    res
        .status(201)
        .json({
            success: true,
            data: user
        })
})





const sendTokenResponse = (user, statusCode, res)=>{
    const token = user.getSignedJwtToken()
    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}