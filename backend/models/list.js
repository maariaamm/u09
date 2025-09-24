const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ListSchema = new Schema({
  userId: { type: String, required: true }, 
  title: String, 
  recipes: [{ type: ObjectId, ref: 'Meal'}],
  savedAt: { type: Date, default: Date.now },
  deletedAt: Date
});

module.exports = mongoose.model('List', ListSchema);