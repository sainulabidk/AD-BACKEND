const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get('/',userController.getAll);
router.post('/sign-up',userController.signup);
router.post('/sign-in',userController.signin);
router.get('/logout',userController.logout);
router.post('/verify-email',userController.mailVerification);
module.exports = router