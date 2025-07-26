export const successHandler = (req, res, next) => {
  res.success = (data = null, message = 'Success') => {
    res.status(res.statusCode || 200).json({
      success: true,
      data,
      message
    })
  }
  next()
}