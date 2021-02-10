// Authentication

const jwt = require('jsonwebtoken');
const config = require('config');

const authMid = (req, res, next) => {
    // - Get token from header
    const token = req.header('x-auth-token');

    // - if there is no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // console.log(decoded)
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err.message)
        res.status(401).json({ msg: 'Token is not valid' })
    }
}
module.exports = authMid