const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/TodoList')
  .then(() => console.log('Connected!'));

const TaskListSchema = new mongoose.Schema({
  Description: {
    type: String,
    required: true
  },
  due_Date: {
    type: Date,
    required: true
  },
  state: {
    type: String,
    required: true
  }
});

const TaskList = mongoose.model('TaskList', TaskListSchema);

app.listen(3000, () => {
  console.log('listening');
});

// GET all tasks
app.get('/tasks', async (req, res) => {
  let result = await TaskList.find();
  res.send(result);
});

// POST a new task
app.post('/tasks', async (req, res) => {
  const { task, date, state } = req.body;

  try {
    const newTask = new TaskList({
      Description: task,
      due_Date: new Date(date),
      state: state
    });

    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create task', details: error });
  }
});

// DELETE a task by ID
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await TaskList.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).send({ error: 'Task not found' });

    res.send({ message: 'Task deleted successfully', deletedTask });
  } catch (err) {
    res.status(500).send({ error: 'Failed to delete task', details: err });
  }
});

// PATCH (update) a task by ID
app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { task, date, state } = req.body;

  try {
    const updatedTask = await TaskList.findByIdAndUpdate(
      id,
      {
        Description: task,
        due_Date: new Date(date),
        state
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) return res.status(404).send({ error: 'Task not found' });

    res.send({ message: 'Task updated successfully', updatedTask });
  } catch (err) {
    res.status(400).send({ error: 'Failed to update task', details: err });
  }
});
