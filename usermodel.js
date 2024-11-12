// Create a new file named `userModel.js` or update the existing one

const mongoose = require('mongoose');
const Financial = require('./financialModel');  // Make sure to import the Financial model

// Define the User schema
const userSchema = new mongoose.Schema({
  user: { type: String, required: true },  // Username field
  password: { type: String, required: true },  // Plain text password field (for testing purposes)
  financialInfo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Financial',  // Reference to the Financial model
    required: true     // Optional, but ensures financial info is always present
  }
},{collection:'login'});  // Ensure the collection name is 'login'

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
