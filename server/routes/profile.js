// routes/profile.js
const express = require('express');
const mongoose = require("mongoose");
const Profile = require('../models/Profile'); // Should point to compiled model

// routes/profile.js (add at the top)
const fs = require('fs');

const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads'); // Adjusted path
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  
  

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// server/index.js
router.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      profileRoute: 'Active'
    });
  });
  

// Get or create default profile
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne({ isDefault: true });
    
    if (!profile) {
      profile = await Profile.create({
        name: 'Default User',
        email: 'user@example.com',
        isDefault: true
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ 
      message: 'Profile operation failed',
      error: error.message
    });
  }
});

// Unified update endpoint
// routes/profile.js
router.put('/', upload.single('profilePicture'), async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        email: req.body.email
      };
  
      if (req.file) {
        updateData.profilePicture = `/uploads/${req.file.filename}`;
      }
  
      const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      };
  
      const updatedProfile = await Profile.findOneAndUpdate(
        { isDefault: true },
        updateData,
        options
      );
  
      res.json(updatedProfile);
    } catch (error) {
      console.error('Update error:', error);
      res.status(400).json({
        message: 'Update failed',
        error: error.message
      });
    }
  });
  

module.exports = router;
