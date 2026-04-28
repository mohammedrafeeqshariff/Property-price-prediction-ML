const express = require('express');
const router = express.Router();
const { 
    uploadTurf, 
    getAllTurfs, 
    getSingleTurf, 
    updateTurf, 
    deleteTurf,
    getOwnerTurfs
} = require('../controllers/turfController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/all', getAllTurfs);
// Protected routes
router.get('/owner', isAuthenticatedUser, authorizeRoles('owner'), getOwnerTurfs);
router.post('/upload', isAuthenticatedUser, authorizeRoles('owner'), uploadTurf);
router.get('/:id', getSingleTurf);
router.put('/:id', isAuthenticatedUser, authorizeRoles('owner'), updateTurf);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('owner'), deleteTurf);

module.exports = router;
