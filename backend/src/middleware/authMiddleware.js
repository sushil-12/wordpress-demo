const jwt = require('jsonwebtoken');
const { CustomError, ErrorHandler } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new CustomError(401, 'Unauthorized - No Authorization token passed!');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new CustomError(401, 'Unauthorized - Invalid token format');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { verifyToken };

