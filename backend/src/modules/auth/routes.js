const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers, updatePermission } = require('./controller');
const { protect, admin } = require('../../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.post('/update-permission', protect, admin, updatePermission);

module.exports = router;