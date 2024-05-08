const mongoose = require('mongoose');
const productSchema = require('./products.mode');
const addressSchema = require('./address.model');

const userSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String,},
  password: { type: String,},
  verified:{type:Boolean,default:false},
  role: { type: String, enum: ['Customer', 'Admin', 'Agent'], default: 'Customer' },
  email: { type: String,unique:true},
  address:addressSchema, 
  products: [productSchema],
  glCode: { type: String },
  orgId: { type: String },
  orgName: { type: String },
  country: { type: String },
  deviceId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'admin' },
  updatedBy: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }

},{collection: "userData" });

const User = mongoose.model('User', userSchema);

module.exports = User;