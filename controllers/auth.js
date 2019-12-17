const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    //For production
    if (process.env.NODE_ENV === 'production') {
        //https
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token: token
        });
}

// @desc       Register user
// @route      Post /api/v2/auth/register
// @access     Public
exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res)
}

// @desc       Login user
// @route      Post /api/v2/auth/register
// @access     Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    //Validate email & password
    // if (!email || !password) {
    //     return next(new ErrorResponse('Please provide an email and password', 400))
    // }

    //Check for user
    const user = await User.findOne({ email }).select('+password');

    // if (!user) {
    //     return next(new ErrorResponse('Invalid credentials', 401))
    // }

    //Check if password matched
    const isMatch = await user.matchPassword(password);

    // if (!isMatch) {
    //     return next(new ErrorResponse('Invalid credentials', 401))
    // }

    //Create token
    sendTokenResponse(user, 200, res)
}

// @desc       Get current logged in user
// @route      Post /api/v2/auth/me
// @access     Private

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
}

