const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    //For production
    if (process.env.NODE_ENV === 'production') {
        // for https
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
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });
        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};

// @desc       Login user
// @route      Post /api/v2/auth/register
// @access     Public
exports.login = async (req, res, next) => {
    try {
        // Validate email & password
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorResponse('Please provide email and password', 400));
        }

        //Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials (email)', 401));
        }

        //Check if password matches (model method)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials (password)', 401));
        }
        //Create token
        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};

// @desc       Get current logged in user
// @route      Post /api/v2/auth/me
// @access     Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });

    } catch (err) {
        next(err);
    }
};


// @desc       Forgot password
// @route      Post /api/v2/auth/forgotpassword
// @access     Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorResponse(`There is no user with that email`, 404))
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v2/auth/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message: message
            })
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.getResetPasswordToken = undefined;

            await user.save({ validateBeforeSave: false });
            return next(new ErrorResponse('Email could not be sent', 500))
        }

        res.status(200).json({
            success: true,
            data: `Email sent`,
        })

    } catch (err) {
        next(err);
    }
};

// @desc       Reset password
// @route      Put /api/v2/auth/resetpassword/:resettoken
// @access     Private
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorResponse('Invalid reset token', 400));
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.getResetPasswordToken = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};
