const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../validations/user.validation');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;

