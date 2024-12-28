const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  panNumber: { type: String },
  otp: { type: String },
  aadhaarName: { type: String },   // New field for Aadhaar Name
  aadhaarNumber: { type: String }, // New field for Aadhaar Number
  aadhaarDob: { type: String },    // New field for Aadhaar DOB
  lastOtp: { type: String }        // New field for Last OTP
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
