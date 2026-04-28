const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token); 

        if (!decoded || !decoded.userId) {
            return next(new ErrorHandler('Invalid Token', 401));
        }

        const user = await User.findOne({ appwriteId: decoded.userId });

        if (!user) {
            return next(new ErrorHandler('User not found in database', 404));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler('Authentication Failed', 401));
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
};

