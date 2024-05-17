const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const dotenv = require("dotenv");
const isAdmin = require('../middleware/isAdmin');
const Products = require('../models/products.mode');
dotenv.config();

const bucket = 'andrus-e-commerce';
async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

exports.uploadImage = async (req, res) => {
  try {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      const url = await uploadToS3(path, originalname, mimetype);
      uploadedFiles.push(url);
    }
    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

exports.addProducts = async (req, res) => {
  try {
    await isAdmin(req, res);
    const requiredFields = ['productName', 'description', 'category', 'price', 'inventory', 'availability'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({ error: 'images are empty' });
    }
   
    const newProducts = {
      productName: req.body.productName,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      images: req.body.images,
      inventory: req.body.inventory,
      availability:req.body.availability
    }
    await Products.create(newProducts);
    res.status(200).json({ message: "Product added successfully" })
  } catch {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

exports.getAllProducts = async (req, res) => {

  try {
    res.json(res.paginatedResult);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}
exports.getProductsById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
}


exports.updateProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, category, price, images, inventory, availability } = req.body;
    const requiredFields = ['productName', 'description', 'category', 'price', 'inventory', 'availability'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({ error: 'images are empty' });
    }
  
    const updatedProduct = await Products.findByIdAndUpdate(id, {
      productName,
      description,
      category,
      price,
      images,
      inventory,
      availability

    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedProduct = await Products.findByIdAndDelete(id);
    
    if (deletedProduct) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}