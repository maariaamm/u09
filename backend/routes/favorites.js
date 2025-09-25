const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const favs = await Favorite.find({ userId: req.user.uid }).sort({ savedAt: -1 });
  res.json(favs);
});

router.post('/', async (req, res) => {
  const { mealId, title, thumbnail } = req.body;
  if (!mealId) return res.status(400).json({ msg: 'mealId saknas' });

  const exists = await Favorite.findOne({ userId: req.user.uid, mealId });
  if (exists) return res.status(200).json(exists);

  const fav = new Favorite({ userId: req.user.uid, mealId, title, thumbnail });
  await fav.save();
  res.status(201).json(fav);
});

router.delete('/:id', async (req, res) => {
  const fav = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
  if (!fav) return res.status(404).json({ msg: 'Hittades inte' });
  res.json({ msg: 'Raderad' });
});

module.exports = router;