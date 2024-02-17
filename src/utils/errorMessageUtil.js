const mongoose = require('mongoose');

exports.errorMessenger = (err) => {
    let message = '';

    if (err instanceof mongoose.Error.ValidationError) {

        const firstError = Object.values(err.errors)[0];
        if (firstError && firstError.message) {
            message = firstError.message;
        } else {
            message = 'Validation error'
        }
    } else if (err instanceof mongoose.MongooseError) {

        message = Object.values(err.errors).at(0).message;


    } else if (err instanceof Error) {

        message = err.message;

    };

    return message;
}