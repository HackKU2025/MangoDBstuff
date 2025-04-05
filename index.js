const express = require('express');
const { connectToDatabase } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

let db, users, watchlist;

connectToDatabase().then(client => {
  db = client.db(process.env.DB_NAME);
  users = db.collection('users');
  watchlist = db.collection('watchlist');
});

// Create a user
app.post('/users', async (req, res) => {
  const result = await users.insertOne(req.body);
  res.send(result);
});

// Add to watchlist
app.post('/watchlist', async (req, res) => {
  const result = await watchlist.insertOne({
    ...req.body,
    addedAt: new Date()
  });
  res.send(result);
});

// Get watchlist for a user
app.get('/watchlist/:userId', async (req, res) => {
  const items = await watchlist.find({ userId: req.params.userId }).toArray();
  res.send(items);
});

// Update watchlist item (e.g., status)
app.put('/watchlist/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const result = await watchlist.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
});

// Delete watchlist item
app.delete('/watchlist/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const result = await watchlist.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
