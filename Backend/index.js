const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const dbUrl = process.env.ATLASDB_URL


mongoose.connect(dbUrl)
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('listening');
});


app.get('/tasks', async (req, res) => {
  let result = await TaskList.find();
  res.send(result);
});


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
