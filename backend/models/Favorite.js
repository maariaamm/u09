const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
  userId: { type: String, required: true }, // från Firebase token uid
  mealId: { type: String, required: true }, // idMeal från MealDB
  title: String,
  thumbnail: String,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);