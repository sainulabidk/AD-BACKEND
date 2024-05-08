const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    images: [{ type: String }],
    inventory: { type: Number },
    availability: { type: Boolean }
});

module.exports = productSchema;
