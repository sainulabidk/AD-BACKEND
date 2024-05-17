const express = require('express');
const router = express.Router();
const authController = require("../controllers/authControllers");
const userController = require("../controllers/userControllers");
const verifyToken = require('../utils/verifyToken');

router.get('/',authController.getAll);
router.get('/logout',authController.logout);
router.get("/get-all-users",verifyToken,userController.getAllUsers);
router.get("/agent/:id",userController.getAgentRoleByUserId);
router.post('/sign-up',authController.signup); 
router.post('/sign-in',authController.signin);
router.post('/verify-email',authController.mailVerification);
router.put('/update-profile/:id',verifyToken,userController.updateProfile); 
router.put('/update-role/:id',verifyToken,userController.updateUserRole); 


module.exports = router