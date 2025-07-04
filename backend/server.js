const authMiddleware = require('./middleware/auth.js'); // ✅ Adjust the path if different
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const verifyToken = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Atlas connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ User model
const User = require('./models/user');

// ✅ OTP storage (in-memory)
const otpStore = new Map();

// ✅ Register with OTP email
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password,
      isPremium: false // ✅ Ensure this is set
    });

    await newUser.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    // Nodemailer code (same as yours)...
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"CareerDendro" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your CareerDendro OTP Verification',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    });

    res.status(200).json({ message: 'OTP sent to email', email });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ OTP Verification
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (storedOtp === otp) {
    await User.findOneAndUpdate({ email }, { isVerified: true });
    otpStore.delete(email);
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});


// ✅ Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // 🔐 Optional: check if verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isPremium: !!user.premiumPlan && new Date(user.premiumExpiresAt) > new Date()
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/premium-status', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const isActive = user.premiumPlan && new Date(user.premiumExpiresAt) > new Date();
  res.json({ isPremium: isActive });
});

// ✅ Static career data
const careers = [
  {
    title: "Software Developer",
    image: "http://localhost:3000/images/software-dev.jpg",
    description: "Create powerful applications and shape the digital future."
  },
  {
    title: "Doctor",
    image: "http://localhost:3000/images/doctor.jpg",
    description: "Diagnose and treat patients, saving lives every day."
  },
  {
    title: "Chartered Accountant",
    image: "http://localhost:3000/images/ca.jpg",
    description: "Manage finances, audits, and ensure compliance."
  },
  {
    title: "Data Scientist",
    image: "http://localhost:3000/images/data-science.jpg",
    description: "Analyze complex data to uncover business insights."
  },
  {
    title: "UX Designer",
    image: "http://localhost:3000/images/ux-designer.jpg",
    description: "Design intuitive and engaging digital experiences."
  },
  {
    title: "Entrepreneur",
    image: "http://localhost:3000/images/entrepreneur.jpg",
    description: "Launch and scale your own successful venture."
  }
];

app.get('/api/careers', (req, res) => {
  res.json(careers);
});

// ✅ Chat using OpenRouter API
// Existing career route
app.get('/api/careers', (req, res) => {
  res.json(careers);
});

// ✅ Updated chat route with full context
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Message history is required' });
  }

  // Convert messages to format required by OpenRouter (OpenAI-style)
  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // or any model you prefer
        messages: formattedMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('OpenRouter Chat Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'OpenRouter chat failed' });
  }
});


// ✅ Career Recommendation using OpenRouter
app.post('/api/recommend', async (req, res) => {
  const { interests } = req.body;

  if (!interests || interests.length === 0) {
    return res.status(400).json({ error: 'Interests are required' });
  }

  const prompt = `Suggest 10 suitable career options for a student with the following interests: ${interests.join(', ')}.
Return ONLY a JSON array like this (no explanation, no markdown):

[
  {
    "title": "Career Title",
    "category": "Category",
    "description": "Short description",
    "skills": ["Skill1", "Skill2"],
    "roadmap": ["Step1", "Step2"],
    "salary": "₹X–Y LPA",
    "colleges": ["College1", "College2"]
  }
]`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let raw = response.data.choices[0].message.content.trim();
    raw = raw.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

    try {
      const parsedCareers = JSON.parse(raw);
      res.json({ careers: parsedCareers });
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      res.status(500).json({ error: '❌ AI response was not valid JSON.', rawText: raw });
    }

  } catch (error) {
    console.error('OpenRouter Recommend Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// ✅ TOP COLLEGES ROUTE using OpenRouter
app.post('/api/colleges', async (req, res) => {
  const { course, location, collegeName } = req.body;

  if ((!course || !location) && !collegeName) {
    return res.status(400).json({
      error: '❌ Please provide either Course & Location OR College Name.'
    });
  }

  const collegeTemplate = `
[
  {
    "name": "College Name",
    "location": "City/State",
    "course": "Popular Course",
    "type": "Government / Private",
    "affiliation": "UGC / AICTE / Autonomous",
    "ranking": "NIRF 2024 Rank: #X",
    "fees": "₹X lakhs per year",
    "placementRate": "XX%",
    "topRecruiters": ["Company A", "Company B", "Company C"],
    "faculty": "Highly qualified with PhDs and industry experience",
    "campusLife": "Modern infrastructure, clubs, and events",
    "entranceExam": "JEE / CAT / NEET / Others",
    "admissionDeadline": "DD-MM-YYYY",
    "cutOffs": {
      "Computer Science": "98 percentile",
      "Information Technology": "96 percentile",
      "Artificial Intelligence": "94 percentile"
    },
    "website": "https://examplecollege.edu.in"
  }
]
`;

  const prompt = collegeName
    ? `Give complete detailed information about the college "${collegeName}" in valid JSON format including branch-wise cutoffs like:\n${collegeTemplate}`
    : `Suggest top 10 reputed colleges in ${location} that offer a degree or specialization in "${course}". Return ONLY valid JSON with branch-wise cutoffs like:\n${collegeTemplate}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30s timeout
      }
    );

    let raw = response.data.choices[0].message.content.trim();

    // Clean unwanted markdown/code explanation
    raw = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^\s*Here (is|are).*?:\s*/i, '') // remove "Here are..." etc
      .trim();

    let parsed;
    if (raw.startsWith('[')) {
      parsed = JSON.parse(raw);
    } else {
      const match = raw.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('No valid JSON array found in response');
      }
    }

    const result = Array.isArray(parsed) ? parsed : [parsed];
    res.json({ colleges: result });

  } catch (err) {
    console.error('❌ Error:', err.message || err);
    if (err.response?.data?.error?.message === 'timeout') {
      return res.status(408).json({ error: 'OpenRouter request timed out.' });
    }
    res.status(500).json({
      error: 'Failed to retrieve valid college data from OpenRouter.',
      details: err.message || err,
    });
  }
});

app.get('/api/quiz-questions', async (req, res) => {
  const count = parseInt(req.query.count) || 10;

  const prompt = `
Generate ${count} personality quiz questions for students, each with 4 multiple-choice options.
Return a JSON array like:
[
  {
    "question": "What do you enjoy doing the most?",
    "options": ["Solving puzzles", "Helping friends", "Drawing and painting", "Building models"]
  }
]
Only return valid JSON. No explanation or markdown.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let raw = response.data.choices[0].message.content.trim();
    raw = raw.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
      // Validate structure
      const valid = Array.isArray(parsed) &&
        parsed.every(q =>
          q.question && Array.isArray(q.options) && q.options.length === 4
        );

      if (!valid) {
        throw new Error('Invalid question format from AI');
      }

      res.json({ questions: parsed });
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr);
      console.log('Raw output (truncated):', raw.slice(0, 300));
      res.status(500).json({ error: 'Failed to parse quiz questions from AI response.' });
    }

  } catch (err) {
    console.error('Quiz Question Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch questions from AI.' });
  }
});


// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
