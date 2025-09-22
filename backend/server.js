require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

const app = express();
app.use(cors({
  origin: "*",
  methods: ["*"],
  allowedHeaders: ["*"],
  "preflightContinue": true,
}));app.use(express.json());

// Init Firebase admin with JSON file
if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  console.warn('Missing FIREBASE_SERVICE_ACCOUNT_PATH env var - auth will fail');
} else {
  const serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

app.get('/', (req,res) => res.send('Meal-app backend'));

app.use('/api/favorites', require('./routes/favorites'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));