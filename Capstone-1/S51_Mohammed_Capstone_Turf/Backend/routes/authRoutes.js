const express = require('express');
const router = express.Router();
const { syncUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middlewares/authMiddleware');

router.post('/sync', syncUser);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/profile', isAuthenticatedUser, updateProfile);

module.exports = router;
