const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
  mealId: { type: String, required: true }, 
  title: String,
  thumbnail: String,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', MealSchema);