const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
const { check, validationResult } = require('express-validator')
const { User } = require('../models');

// @route  POST api/users
// @desc   Register User
// @access public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please includes a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;

  try {
    let userFindByEmail = await User.findOne({ email: email });

    if (userFindByEmail) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    const salt = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(password, salt);

    let user = new User({
      name: name,
      email: email,
      avatar: avatar,
      password: encryptedPassword
    });

    await user.save(); 

    const payload = {
      user: {
        id: user.id,
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token: token })
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;