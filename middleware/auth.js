const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');


//Check if the token is valid
exports.protect = async (req, res, next) => {
  let token;

  // Set token from Bearer token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route (no token)', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next(); // pre route middleware

  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route (invalid token)', 401)); // Catch error and stop.
  }
}

//Grand access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  }
}
