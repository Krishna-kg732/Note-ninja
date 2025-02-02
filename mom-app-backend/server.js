const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Database
let users = [];
let meetings = [];

// Helper Functions
const findUserByEmail = (email) => users.find((user) => user.email === email);
const findMeetingById = (id) => meetings.find((meeting) => meeting.id === id);

// Routes

// Sign Up
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.status(201).json({ message: 'User created successfully', user: newUser });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.status(200).json({ message: 'Login successful', user });
});

// Account Recovery
app.post('/api/recover', (req, res) => {
  const { email } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'Recovery instructions sent to your email' });
});

// Get All Meetings
app.get('/api/meetings', (req, res) => {
  res.status(200).json(meetings);
});

// Create a New Meeting
app.post('/api/meetings', (req, res) => {
  const { title, description, date } = req.body;
  const newMeeting = { id: meetings.length + 1, title, description, date };
  meetings.push(newMeeting);
  res.status(201).json({ message: 'Meeting created successfully', meeting: newMeeting });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
async function fetchMeetings() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/meetings`);
    const data = await response.json();
    const meetingList = document.getElementById('meetingList');

    if (response.ok) {
      meetingList.innerHTML = data
        .map((meeting) => `<li>${meeting.title} - ${meeting.date}</li>`)
        .join('');
    } else {
      console.error('Failed to fetch meetings');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchMeetings(); // Call this function when the dashboard loads