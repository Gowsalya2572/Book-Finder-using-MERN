const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const booksRoutes = require('./routes/books');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

app.use('/api', booksRoutes);

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Book Finder API' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
