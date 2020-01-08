const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc       Get all users
// @route      Get /api/v2/users
// @access     Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        res.status(200).json(res.advancedResults);
    } catch (err) {
        next(err);
    }
};

// @desc       Get single user
// @route      Get /api/v2/users/:id
// @access     Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (err) {
        next(err);
    }
};

// @desc       Create user
// @route      Post /api/v2/users
// @access     Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        user.password = undefined;

        res.status(201).json({
            success: true,
            data: user,
        })
    } catch (err) {
        next(err);
    }
};

// @desc       Update user
// @route      Put /api/v2/users/:id
// @access     Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (err) {
        next(err);
    }
};

// @desc       Delete user
// @route      DELETE /api/v2/users/:id
// @access     Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            data: `User id ${user.id} Deleted.`
        })
    } catch (err) {
        next(err);
    }
};

