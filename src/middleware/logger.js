// @desc logs request to console

function logger (req, res, next) {
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  console.log(req.body)
  console.log(res.body)
  next()
}

module.exports = logger
