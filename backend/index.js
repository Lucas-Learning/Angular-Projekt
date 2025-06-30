const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = []; // In-memory storage (replace with a DB later)

// Register
app.post('/api/register', (req, res) => {
  const { emailId, fullName, password } = req.body;
  users.push({ emailId, fullName, password });
  res.status(201).json({ message: 'User registered successfully!' });
});

// Login
app.post('/api/login', (req, res) => {
  const { emailId, password } = req.body;
  const user = users.find(u => u.emailId === emailId && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token: 'fake-jwt-token', user });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
