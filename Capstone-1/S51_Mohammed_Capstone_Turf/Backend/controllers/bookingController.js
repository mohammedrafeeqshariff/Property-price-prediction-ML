const Booking = require('../models/bookingModel');
const Turf = require('../models/turfModel');
const ErrorHandler = require('../utils/errorHandler');

// @desc    Create a new booking
// @route   POST /api/booking/book
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
    try {
        const { turfId, bookingDate, timeSlot, totalPrice } = req.body;
        const userId = req.user.appwriteId;

        // Verify turf existence and get owner ID
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return next(new ErrorHandler('Turf not found', 404));
        }

        // Check if slot is already booked
        const existingBooking = await Booking.findOne({
            turfId,
            bookingDate,
            'timeSlot.start': timeSlot.start,
            status: 'confirmed'
        });

        if (existingBooking) {
            return next(new ErrorHandler('This slot is already booked', 400));
        }

        const booking = await Booking.create({
            turfId,
            userId,
            ownerId: turf.userID, // Owner ID from turf
            bookingDate,
            timeSlot,
            totalPrice
        });

        res.status(201).json({
            success: true,
            message: 'Booking confirmed!',
            booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get availability for turf on specific date
// @route   GET /api/booking/availability/:turfId
// @access  Public
exports.getAvailability = async (req, res, next) => {
    try {
        const { turfId } = req.params;
        const { date } = req.query;

        if (!date) {
            return next(new ErrorHandler('Date query parameter is required', 400));
        }

        const bookedSlots = await Booking.find({
            turfId,
            bookingDate: date,
            status: 'confirmed'
        }).select('timeSlot');

        res.status(200).json({
            success: true,
            bookedSlots: bookedSlots.map(b => b.timeSlot)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's booking history
// @route   GET /api/booking/my-bookings
// @access  Private (User)
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.appwriteId }).populate('turfId');
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get owner's bookings for their turfs
// @route   GET /api/booking/owner-bookings
// @access  Private (Owner)
exports.getOwnerBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ ownerId: req.user.appwriteId }).populate('turfId');
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   PUT /api/booking/cancel/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return next(new ErrorHandler('Booking not found', 404));
        }

        // Verify ownership (either user who booked or owner of turf)
        if (booking.userId !== req.user.appwriteId && booking.ownerId !== req.user.appwriteId) {
            return next(new ErrorHandler('Not authorized to cancel this booking', 403));
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};
