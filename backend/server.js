const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3004' // Allow requests from this origin
}));


const jwtSecret = process.env.JWT_SECRET; // Access the JWT secret from environment variables

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Attach user to request
    next(); // Proceed to the next middleware or route handler
  });
};

// Login route
app.post('/login', async (req, res) => {
  // Assume user authentication is successful
  const user = { id: 'user_id', username: 'username' }; // Replace with actual user data

  // Sign the JWT
  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

  // Send the token in the response
  res.json({ token });
});

// Example of a protected route
app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});



// Use cors middleware
app.use(cors({
  origin: ['https://backend-33ybmcleb-naziya-shaikhs-projects.vercel.app', 'http://localhost:3004'], // Allow requests from these origins
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true // Allow credentials if needed
}));

// MongoDB connection
const mongoURI = 'mongodb+srv://naziya:wvUfuGUHt26GYPd@cluster0.oswlq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema
const DataSchema = new mongoose.Schema({
  field1: Number,
  field2: String,
});

const DataModel = mongoose.model('Data', DataSchema);
// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the Aaggregate functions of backend!');
});

// POST /data route
app.post('/data', async (req, res) => {
  const newData = new DataModel(req.body);
  await newData.save();
  res.status(201).send(newData);
});

// GET /aggregate route
app.get('/aggregate', async (req, res) => {
  const result = await DataModel.aggregate([
    { $group: { _id: "$field2", count: { $sum: 1 }, average: { $avg: "$field1" } } },
    { $sort: { count: -1 } }
  ]);
  res.status(200).send(result);
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
