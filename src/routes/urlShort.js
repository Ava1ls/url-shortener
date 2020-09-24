const express = require('express')
const {getShortUrl, shortenUrlRedirect} = require('../controllers/urlShort')

const router = express.Router()

router  
    .post('/', getShortUrl)
    .get('/:shortUrl', shortenUrlRedirect)

module.exports = router