const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const productsController = require("../controllers/productsController");
const verifyToken = require('../utils/verifyToken');
const multer=require('multer');
const photomiddleware=multer({dest:'/tmp'})

router.get("/todos",categoryController.allCategories);
router.post("/todos",verifyToken,categoryController.postCategories);
router.put('/todos/:id',verifyToken,categoryController.editCategories); 
router.delete('/todos/:id',verifyToken,categoryController.deleteCategories); 

router.post("/upload",photomiddleware.array('photos',100),productsController.addProduct); 


module.exports = router