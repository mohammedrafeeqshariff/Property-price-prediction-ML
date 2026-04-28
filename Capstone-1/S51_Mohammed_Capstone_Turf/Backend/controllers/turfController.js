const Turf = require('../models/turfModel');
const ErrorHandler = require('../utils/errorHandler');
const turfUploadValidator = require('../utils/JOIvalidator');

// @desc    Upload/Create a new turf
// @route   POST /api/turf/upload
// @access  Private (Owner)
exports.uploadTurf = async (req, res, next) => {
    try {
        const { error } = turfUploadValidator(req.body);
        if (error) {
            return next(new ErrorHandler(error.details[0].message, 400));
        }

        const turf = await Turf.create({
            ...req.body,
            userID: req.user.appwriteId // Linking to Appwrite ID from authenticated user
        });

        res.status(201).json({
            success: true,
            message: 'Turf uploaded successfully',
            turf
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get turfs owned by the authenticated user
// @route   GET /api/turf/owner
// @access  Private (Owner)
exports.getOwnerTurfs = async (req, res, next) => {
    try {
        const turfs = await Turf.find({ userID: req.user.appwriteId });
        res.status(200).json({ success: true, turfs });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all turfs with filtering and pagination
// @route   GET /api/turf/all
// @access  Public
exports.getAllTurfs = async (req, res, next) => {
    try {
        const { category, location, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        
        const query = {};
        if (category) query.turfSportCategory = category;
        if (location) query.turfDistrict = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.turfPrice = {};
            if (minPrice) query.turfPrice.$gte = Number(minPrice);
            if (maxPrice) query.turfPrice.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;
        const total = await Turf.countDocuments(query);
        const turfs = await Turf.find(query).skip(skip).limit(Number(limit));

        res.status(200).json({
            success: true,
            count: turfs.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            turfs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single turf by ID
// @route   GET /api/turf/:id
// @access  Public
exports.getSingleTurf = async (req, res, next) => {
    try {
        const turf = await Turf.findById(req.params.id);
        if (!turf) {
            return next(new ErrorHandler('Turf not found', 404));
        }

        res.status(200).json({
            success: true,
            turf
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update turf
// @route   PUT /api/turf/:id
// @access  Private (Owner)
exports.updateTurf = async (req, res, next) => {
    try {
        let turf = await Turf.findById(req.params.id);
        if (!turf) {
            return next(new ErrorHandler('Turf not found', 404));
        }

        if (turf.userID !== req.user.appwriteId) {
            return next(new ErrorHandler('You are not authorized to update this turf', 403));
        }

        turf = await Turf.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            turf
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete turf
// @route   DELETE /api/turf/:id
// @access  Private (Owner)
exports.deleteTurf = async (req, res, next) => {
    try {
        const turf = await Turf.findById(req.params.id);
        if (!turf) {
            return next(new ErrorHandler('Turf not found', 404));
        }

        if (turf.userID !== req.user.appwriteId) {
            return next(new ErrorHandler('You are not authorized to delete this turf', 403));
        }

        await turf.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Turf deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
