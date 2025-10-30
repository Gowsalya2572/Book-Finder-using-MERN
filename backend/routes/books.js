const express = require('express');
const axios = require('axios');
const router = express.Router();
const Favorite = require('../models/favorite');

// Proxy search to Open Library: /api/search?title=...
router.get('/search', async (req, res) => {
  try {
    const { title, page = 1, limit = 20 } = req.query;
    if (!title) return res.status(400).json({ error: 'title query parameter required' });

    // Open Library supports page param; we fetch directly
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&page=${page}&limit=${limit}`;
    const resp = await axios.get(url, { timeout: 8000 });
    return res.json(resp.data);
  } catch (err) {
    console.error('OpenLibrary error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch from Open Library' });
  }
});

// Favorites endpoints
router.get('/favorites', async (req, res) => {
  try {
    const favs = await Favorite.find().sort({ createdAt: -1 }).limit(200);
    res.json(favs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    const { olKey, title, authors = [], cover_i, first_publish_year, isbn = [] } = req.body;
    if (!olKey || !title) return res.status(400).json({ error: 'olKey and title required' });

    const fav = new Favorite({ olKey, title, authors, cover_i, first_publish_year, isbn });
    await fav.save();
    res.status(201).json(fav);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Already favorited' });
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

router.delete('/favorites/:olKey', async (req, res) => {
  try {
    const { olKey } = req.params;
    const deleted = await Favorite.findOneAndDelete({ olKey });
    if (!deleted) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

module.exports = router;
