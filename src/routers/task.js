const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

// Configured with query string for control over data returned.
router.get('/tasks', auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });

    const match = {};

    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    await req.user
      .populate({
        path: 'tasks',
        match
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id; //Mongoose allows us NOT to have to convert this to ObjectID object.

  try {
    // Find a task by ID and verifying owner is one currently logged in.
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.sendStatus(404);
    res.send(task);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/tasks', auth, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    const createdTask = await newTask.save();
    res.status(201).send(createdTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidToUpdate = updates.every(field =>
    allowedUpdates.includes(field)
  );

  if (!isValidToUpdate)
    return res.status(400).send('Error: Invalid updates attempted.');

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true, //NEW returns updated object
    //   runValidators: true // Runs validation
    // });
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    updates.forEach(field => (task[field] = req.body[field]));

    task.save();

    if (!task) return res.sendStatus(404);
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!deletedTask) return res.sendStatus(404);
    res.send(deletedTask);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
