const express = require('express');
const router = express.Router();

const taskRepo = require('./repository/task.repository');

const authenticateToken = require('./middleware/authenticate');

router.get('/tasks', async (req, res) => {
  

  res.json({ status: true });
});

router.post('/tasks', authenticateToken, async (req, res) => {
  console.log('11');
  const task = await taskRepo.save({
    ...req.body
  });

  res.json({ ...task, ...req.user });
});

router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const task = await taskRepo.findOneBy({ id });

  res.json(task);
});

module.exports = router;
