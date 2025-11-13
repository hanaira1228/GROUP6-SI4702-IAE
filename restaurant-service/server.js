const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const restaurantRoutes = require('./routes/restaurantRoutes'); // ./ = folder sama level server.js

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurantDB';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/', restaurantRoutes);

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`✅ Server running on port ${3002}`));
