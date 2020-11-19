const express = require('express')
const {getShortUrl, shortenUrlRedirect, createCustomUrl} = require('../controllers/urlShort')

const router = express.Router()

router  
    .post('/', getShortUrl)
    .get('/:shortUrl', shortenUrlRedirect)
    .post('/customurl', createCustomUrl)
module.exports = router