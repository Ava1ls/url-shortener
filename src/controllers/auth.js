const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const AsyncHandler = require('../middleware/asyncHandler')
dotenv.config({ path: '../configs/config.env' })


//App middlewares
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//Functions for auth-check for users
var checkAuthenticated = AsyncHandler(async (req, res, next) =>{
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
})

var checkNotAuthenticated = AsyncHandler(async (req, res, next) =>{
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
})


// @method      Post
// @desc        Register user
// @route       /
// @access      Public
exports.registerUser = AsyncHandler(async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})


// @method      Post
// @desc        Log in to existing user account
// @route       /login
// @access      Public
exports.logInUser = AsyncHandler(async (req, res, next)=>{

})


// @method      Delete
// @desc        Log out current authenthicated user
// @route       /logout
// @access      Public
exports.logOutUser = AsyncHandler(async (req, res, next)=>{
  req.logOut()
  res.redirect('/login')
})