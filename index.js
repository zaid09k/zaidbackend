const express = require('express');
const mongoose = require('mongoose');

// --- Configuration ---
const MONGO_URI = '';
const PORT = 3000;

const app = express();
app.use(express.json()); 

// --- MongoDB Setup ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('API: Successfully connected to MongoDB.'))
  .catch(err => console.error('API: MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  uid: { type: Number, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// --- API Routes ---
app.post('/login', async (req, res) => {
  try {
    const { uid, password } = req.body;

    // 1. Validate input
    if (!uid || !password) {
      return res.status(400).json({ success: false, message: 'Please provide uid and password.' });
    }

    // 2. Find the user
    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // 3. Directly compare the plain text passwords
    if (password === user.password) {
      return res.status(200).json({ success: true, message: 'Login successful!' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
