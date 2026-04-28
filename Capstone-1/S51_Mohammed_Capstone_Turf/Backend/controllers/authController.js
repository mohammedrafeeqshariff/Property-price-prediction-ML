const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

// @desc    Register or Sync User with MongoDB
// @route   POST /api/auth/sync
// @access  Public
exports.syncUser = async (req, res, next) => {
    try {
        const { appwriteId, email, name, role } = req.body;

        if (!appwriteId || !email) {
            return next(new ErrorHandler('Appwrite ID and Email are required', 400));
        }

        let user = await User.findOne({ appwriteId });

        if (!user) {
            user = await User.create({
                appwriteId,
                email,
                name,
                role: role || 'user'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, about, profileImage } = req.body;

        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            about,
            profileImage
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

