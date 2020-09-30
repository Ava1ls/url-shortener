const express = require('express');
const { register, login, getMe, /*forgotPassword, resetPassword,*/ updateDetails, updatePassword } = require('../controllers/auth')

const router = express.Router()

const {protect} = require('../middleware/authHandler');
  
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
//router.post('/forgotpassword', forgotPassword)
//router.put('/resetpassword/:id', protect, resetPassword)
router.put('/updatedetails', updateDetails)
router.put('/updatepassword', protect, updatePassword)

module.exports = router
