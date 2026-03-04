const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ===== CONFIG =====
const PORT = process.env.PORT || 3000;      // ✅ Railway compatible
const MONGO_URI = process.env.MONGO_URI;    // ✅ Env variable

const app = express();
app.use(cors({
  origin: [
    "https://usdtseller-production.up.railway.app" // frontend URL
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ===== MongoDB Setup =====
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('API: MongoDB connected'))
  .catch(err => console.error('API: MongoDB error:', err.message));

// ===== Schema =====
const userSchema = new mongoose.Schema({
  uid: { type: Number, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ===== Routes =====
app.post('/login', async (req, res) => {
  try {
    const { uid, password } = req.body;

    if (!uid || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide uid and password'
      });
    }

    const user = await User.findOne({ uid });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    return res.json({
      success: true,
      message: 'Login successful'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ===== Health Check =====
app.get('/', (req, res) => {
  res.send('Backend running on Railway 🚄');
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
