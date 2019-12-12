// @desc       Get a message
// @route      Get /api/v2/auth
// @access     Public
exports.getMessage = (req, res, next) => {
    res.status(200)
        .send("A message from function getMessage and path '/api/v2/auth'")
}

// @desc       Create a message
// @route      Post /api/v2/auth
// @access     Public
exports.sendMessage = (req, res, next) => {
    res.status(200)
        .send("A message from function sendMessage and path '/api/v2/auth'")
}

// @desc       Update a message
// @route      Put /api/v2/auth
// @access     Public
exports.updateMessage = (req, res, next) => {
    res.status(200)
        .send("A message from function updateMessage and path '/api/v2/auth'")
}

// @desc       Delete a message
// @route      Delete /api/v2/auth
// @access     Public
exports.deleteMessage = (req, res, next) => {
    res.status(200)
        .send("A message from function deleteMessage and path '/api/v2/auth'")
}