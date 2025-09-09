//Module imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const socketIo = require('socket.io');
const http = require('http');
require("dotenv").config();

//Creates the server and the socketIO module that looks after the messages
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET','POST']
  }
})
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET; // Gets the Secret code from the .env file

//connects to the mongoDB database which is were all the data is. The url link is in the .env file
mongoose.connect(`${process.env.MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//Code for logs
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
//Shows who is using the socket/who is connected and who disconnected
io.on('connection', (socket) =>{
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () =>{
    console.log('User disconnected', socket.id);
  });
});
//a get request to get all the users from the database
app.get('/api/getusers', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// A post request which is called everytime we create a user
app.post('/api/register', async (req, res) => {
  //The format for the register body
  const { emailId, fullName, password } = req.body;
  try {
    //Looks for if another use already has the same email
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    //Hashes the password and creats the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ emailId, fullName, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

//Post request everytime someone logs in
app.post('/api/login', async (req, res) => {
  //The format to login
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });//tries to find the email the user typed
    //Unhashes the password to see if it matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    //if it does you get a jwt token signed to your information
    const token = jwt.sign({ id: user._id, emailId: user.emailId }, JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({
      token,
      user: {
        id: user._id,
        emailId: user.emailId,
        fullName: user.fullName
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  const { text, sender } = req.body;
  try {
    const msg = new Message({ text, sender });
    await msg.save();
    io.emit('message', {
      text: msg.text,
      sender: msg.sender,
      timestamp: msg.timestamp,
    });

    res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ error: 'Could not send message' });
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
