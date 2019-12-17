// const User = require('../models/User');

// const sendTokenResponse = (user, statusCode, res) => {
//     const token = user.getSignedJwtToken();
//     const options = {
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//         httpOnly: true
//     }

//     //For production
//     if (process.env.NODE_ENV === 'production') {
//         options.secure = true;
//     }

//     res
//         .status(statusCode)
//         .cookie('token', token, options)
//         .json({
//             success: true,
//             token: token
//         });
// }

// // @desc       Register user
// // @route      Post /api/v2/auth/register
// // @access     Public
// exports.register = async (req, res, next) => {
//     const { name, email, password, role } = req.body;

//     const user = await User.create({
//         name,
//         email,
//         password,
//         role
//     });

//     sendTokenResponse(user, 200, res)
// }

// // @desc       Login user
// // @route      Post /api/v2/auth/register
// // @access     Public
// exports.login = async (req, res, next) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');

//     //Check if password matched
//     const isMatch = await user.matchPassword(password);

//     //Create token
//     sendTokenResponse(user, 200, res)
// }


const User = require('../models/User');

exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    })
}