const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const Financial = require('./financialModel');  // Import the Financial model
const multer = require('multer'); // Import multer for file uploads
const fs = require('fs'); 

// Create an express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: '1234567890', // Use a secure random string as the secret
  resave: false,        // Prevent saving session if not modified
  saveUninitialized: true // Store a session even if it has not been modified
}));

// Add this after your other middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Make sure you have a "views" folder

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/sample');

// Define the User schema
const userSchema = new mongoose.Schema({
    user: String,     // Username field
    password: String, // Plain text password for testing
    financialInfo: { 
      type: mongoose.Schema.Types.ObjectId,  // Reference to Financial model
      ref: 'Financial',  // Reference to the Financial model
      required: true     // Ensure this field is always populated with financial data
    }
  }, { collection: 'login' });

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);

// Serve the login form (HTML page)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
  });



// Handle the login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ user: username });

    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare plain-text passwords (not secure for production)
    const isMatch = user.password === password;

    if (!isMatch) {
      return res.status(400).send('Incorrect password');
    }

    // Create a session for the user
    req.session.userId = user._id; // Store user ID in session

    // Redirect to dashboard after successful login
    res.redirect('/dashboard'); 
  } catch (err) {
    console.error('Error during login:', err);  // Log the error for debugging
    return res.status(500).send('Internal server error');
  }
});

// Serve the dashboard page with populated financial data
app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/'); // Redirect to login if not logged in
    }
  
    try {
      // Find the user by their session ID and populate the 'financialInfo' field with financial data
      const user = await User.findById(req.session.userId).populate('financialInfo');
  
      if (!user || !user.financialInfo) {
        return res.status(400).send('User or financial data not found');
      }
  
      const financialData = user.financialInfo;
  
      // Render the dashboard.ejs template and pass the data
      res.render('dashboard', {
        user: user,         // User data
        financialData: financialData  // Financial data from the 'Financial' collection
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).send('Internal server error');
    }
  });

  

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
