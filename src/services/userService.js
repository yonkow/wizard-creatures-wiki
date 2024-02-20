const User = require("../models/User")

exports.getProfile = (userId) => User.findById(userId).populate('createdAnimals');