const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getAvailability, 
    getMyBookings, 
    getOwnerBookings, 
    cancelBooking 
} = require('../controllers/bookingController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/availability/:turfId', getAvailability);

// Protected routes
router.post('/book', isAuthenticatedUser, authorizeRoles('user'), createBooking);
router.get('/my-bookings', isAuthenticatedUser, authorizeRoles('user'), getMyBookings);
router.get('/owner-bookings', isAuthenticatedUser, authorizeRoles('owner'), getOwnerBookings);
router.put('/cancel/:id', isAuthenticatedUser, cancelBooking);

module.exports = router;
