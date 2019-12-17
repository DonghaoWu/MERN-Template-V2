const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;
  //console.log(req.headers);
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  //Make sure token exists
  // if (!token) {
  //   return res.status(400).json({ success: false })
  // }

  try {
    //console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('hello', decoded.id);
    req.user = await User.findById(decoded.id);
    //console.log(req.user)
    next();
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}
