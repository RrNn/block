const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    try {
      const verified = await jwt.verify(token, process.env.JWT_CERT);
      next();
    } catch (error) {
      console.error('JWT_ERROR', error);
      return res.json({
        success: false,
        message: error.message
      });
    }
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken
}
