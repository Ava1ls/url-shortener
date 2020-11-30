const express = require('express')
const {
    getShortUrl, 
    shortenUrlRedirect, 
    createCustomUrl,
    saveUrl
} = require('../controllers/urlShort')

const router = express.Router()

router  
    .post('/', getShortUrl)
    .get('/:shortUrl', shortenUrlRedirect)
    .post('/customurl', createCustomUrl)
    .patch('/', saveUrl)
module.exports = router