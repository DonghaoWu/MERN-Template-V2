const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  //else if(req.cookiestoken)

  //Make sure token exsts
  if (!token) {
    return res.status(400).json({ success: false })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);

     next();
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}
