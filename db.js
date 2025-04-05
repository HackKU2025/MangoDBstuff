const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB ✅");
  }
  return client;
}

module.exports = { connectToDatabase };
