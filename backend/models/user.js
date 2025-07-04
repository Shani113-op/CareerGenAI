const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false }, // ✅ For OTP verification
  otp: { type: String },                         // ✅ Store OTP
  otpExpiresAt: { type: Date },                  // ✅ Expiry time for OTP

  // ✅ Premium status flag (defaults to false)
  isPremium: {
    type: Boolean,
    default: false
  },

  // ✅ Optional premium plan details
  premiumPlan: {
    type: String, // '1month', '3months', '1year'
    default: null
  },
  premiumExpiresAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

// 🔐 Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
