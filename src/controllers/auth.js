const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
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
// @desc        Generate short url
// @route       /
// @access      Public
exports.s = AsyncHandler(async (req, res, next) => {

})