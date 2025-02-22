// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    isDefault: { 
      type: Boolean, 
      default: true,
      unique: true,
      immutable: true
    },
    name: { 
      type: String, 
      required: true,
      maxlength: 100 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [ /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format']
    },
    profilePicture: {
      type: String,
      default: '/static/default-profile.png'
    }
  }, { 
    timestamps: true,
    autoIndex: true
  });
  
  // Pre-save hook to prevent multiple profiles
  profileSchema.pre('save', async function(next) {
    if (this.isDefault) {
      const exists = await this.constructor.findOne({ isDefault: true });
      if (exists) {
        throw new Error('Default profile already exists');
      }
    }
    next();
  });
  // Add model compilation and export
const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;