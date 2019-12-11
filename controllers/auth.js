// @desc       Get a message
// @route      Get /api/v2/auth
// @access     Public

exports.getMessage = (req, res, next) => {
    console.log('hello');
    res.status(200).send('Hello, This is a getMessage from /api/v2/auth')
}

// @desc       Get a message
// @route      Get /api/v2/auth
// @access     Public
exports.sendMessage = (req, res, next) => {
    console.log('hello');
    res.status(200).send('Hello, This is a sendMessage from /api/v2/auth')
}