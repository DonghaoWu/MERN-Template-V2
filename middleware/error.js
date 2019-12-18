const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    console.log(err);
    // copy the err object,if the error is from catch, redefine it in the if statement,
    // if the error is not from catch, it only has two property, one is message, one is statusCode
    let error = { ...err };

    error.message = err.message; //necessary? Yes, when the error is from ErrorResponse.
    error.statusCode = err.statusCode;

    // Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404); // redefine
    }

    // Mongoose Duplicate field key (重名，非unique)
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400); //redefine
    }

    // Mongoose Validation error
    if (err.name === 'ValidatorError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400); // redefine
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;
