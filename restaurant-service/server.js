const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Restaurant Service API running 🚀');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
