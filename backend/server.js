const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use cors middleware
app.use(cors({
  origin: ['https://backend-9smvdqpdl-naziya-shaikhs-projects.vercel.app'], // Allow requests from these origins
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
