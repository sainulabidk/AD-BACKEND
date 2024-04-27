const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String,},
  password: { type: String,},
  verified:{type:Boolean,default:false},
  role: { type: String, enum: ['Customer', 'Admin', 'Agent'], default: 'Customer' },
  email: { type: String,unique:true},
  mobileNo: { type: String },
  mobileNo2: { type: String },
  glCode: { type: String },
  orgId: { type: String },
  orgName: { type: String },
  country: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  userType: { type: String, enum: ['INDV', 'ORG'], default: 'INDV' },
  deviceId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'admin' },
  updatedBy: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }

},{collection: "userData" });

const User = mongoose.model('User', userSchema);

module.exports = User;