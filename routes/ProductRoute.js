const express = require('express');
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyToken = require('../utils/verifyToken');
const multer=require('multer');
const photomiddleware=multer({dest:'/tmp'})
const Products = require('../models/products.mode');
const paginatedResults = require('../utils/pagination');

router.post("/upload",photomiddleware.array('photos',100),productsController.uploadImage); 
router.post("/add-product",verifyToken,productsController.addProducts); 
// paginated products
router.get("/all-products",paginatedResults(Products),productsController.getAllProducts); 
// end
router.get("/products/:id",productsController.getProductsById);  
router.put("/update-product/:id",productsController.updateProductsById); 
router.delete("/product-delete/:id",productsController.deleteProduct); 

module.exports = router

