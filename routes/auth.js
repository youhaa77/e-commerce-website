const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',check(), authController.postLogin);

router.post('/signup',[check('email').isEmail(),check('password').isLength({min:5})], authController.postSignup);

router.post('/logout',check(), authController.postLogout);

module.exports = router;