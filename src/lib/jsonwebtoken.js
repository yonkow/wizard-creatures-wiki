const util = require('util');
const jwt = require('jsonwebtoken');

const sing = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

module.exports = {
    sing,
    verify,
}