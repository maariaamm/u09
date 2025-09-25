const express = require('express');
const router = express.Router();
const List = require('../models/list');
const auth = require('../middleware/auth');
const Meal = require('../models/meal');

router.use(auth);
router.post('/', async (req, res) => {
  const { title  } = req.body;
  const exists = await List.findOne({ userId: req.user.uid, title });
  if (exists) return res.status(200).json(exists);

  const list = new List({ userId: req.user.uid, title , recipes: [] });
  await list.save();
  res.status(201).json(list);
});


router.patch('/:id', async (req, res) => {
  console.log("PATCH /:id called with body:", req.body);
  const { mealId, title, thumbnail } = req.body;

  let recipe = await Meal.findOne({ 'mealId': mealId });
  if (!recipe && mealId) {
    recipe = new Meal({ mealId, title, thumbnail });
    await recipe.save();
  }
  
  const list = await List.findOne({ _id: req.params.id, userId: req.user.uid });
  if (!list) return res.status(404).json({ msg: 'List not found' });
  if (!recipe && title) list.title = title;

  if (recipe) {
    if (list.recipes.includes(recipe._id)) {
      list.recipes.pull(recipe._id);
    } else {
      list.recipes.push(recipe._id);
    }
  }

  await list.save();
  await list.populate('recipes');
  res.json(list);
});

router.get('/', async (req, res) => {
  const lists = await List.find({ userId: req.user.uid, deletedAt: { $eq: null } }).populate('recipes').sort({ savedAt: -1 });
  res.json(lists);
});

router.get('/:id', async (req, res) => {
  const list = await List.findOne({ _id: req.params.id, userId: req.user.uid }).populate('recipes');
  if (!list) return res.status(404).json({ msg: 'List not found' });
  res.json(list);
});

router.delete('/:id', async (req, res) => {
  const list = await List.findOneAndUpdate({ _id: req.params.id }, { deletedAt: new Date() });
  if (!list) return res.status(404).json({ msg: 'List not found' });
  res.json({ msg: 'List deleted' });
});

module.exports = router;