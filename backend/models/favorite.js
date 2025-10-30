const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  olKey: { type: String, required: true, unique: true }, // OpenLibrary key (e.g. /works/OLXXXXXW or cover id)
  title: String,
  authors: [String],
  cover_i: Number,
  first_publish_year: Number,
  isbn: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
