const shortid = require('shortid')
const validUrl = require('valid-url')
const dotenv = require('dotenv')
const AsyncHandler = require('../middleware/asyncHandler')
const Url = require('../models/Url')

// Load env vars
dotenv.config({ path: '../configs/config.env' })

// @method      Post
// @desc        Generate short url
// @route       /
// @access      Public
exports.getShortUrl = AsyncHandler(async (req, res, next) => {
  const longUrl = req.body.longUrl
  const baseUrl = process.env.BASE_URL

  if (!validUrl.isUri(baseUrl)) {
    return res
      .status(401)
      .json('Internal error. Please come back later.')
  }

  const urlCode = shortid.generate()

  if (validUrl.isUri(longUrl)) {
    Url.findOne({ longUrl: longUrl })

      .then(async (url) => {
        if (url) {
          return res
            .status(200)
            .json(url)
        }

        const shortUrl = baseUrl + '/' + urlCode

        const newUrl = new Url({
          longUrl,
          shortUrl,
          urlCode,
          clickCount: 0
        })

        await newUrl.save()

        return res
          .status(201)
          .json(newUrl)
      })

      .catch((err) => {
        console.error(err.message)
        return res
          .status(500)
          .json(`Internal Server error: ${err.message}`)
      })
  } else {
    res
      .status(400)
      .json('Invalid URL. Please enter a vlaid url for shortening.')
  }
})

// @method      GET
// @desc        Redirect to full url from shorted url
// @route       /:shortedUrl
// @access      Public
exports.shortenUrlRedirect = AsyncHandler(async (req, res, next) => {
  const shortUrlCode = req.params.shortUrl

  const url = await Url.findOne({ urlCode: shortUrlCode })

  if (url) {
    let clickCount = url.clickCount
    clickCount++
    await url.updateOne({ clickCount })
    return res.redirect(url.longUrl)
  } else {
    return res
      .status(404)
      .json({ msg: `Link to full url from ${url.shortUrl} not found` })
  }
})
