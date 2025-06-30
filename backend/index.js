const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ChatDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
// In-memory storage (replace with a DB later)

app.get('/api/getusers', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});
// Register
app.post('/api/register', async (req, res) => {
  const { emailId, fullName, password } = req.body;
  try {
    const newUser = new User({ emailId, fullName, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ token: 'fake-jwt-token', user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
