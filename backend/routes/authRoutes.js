// const express = require('express');

// const authController = require('../controllers/authController');
import express from 'express';
import { register , login } from '../controller/userController.js';
import { getUserProfile, updatePhone } from '../controller/profileController.js';
import  authenticateToken  from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/profile' ,  authenticateToken , getUserProfile);
router.put('/profile' , authenticateToken , updatePhone);

export default router;