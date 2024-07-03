const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/get', (req, res) => {
    TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { done, task, dateTime } = req.body;
    TodoModel.findById(id)
        .then(todo => {
            if (done !== undefined) todo.done = done;
            if (task !== undefined) todo.task = task;
            if (dateTime !== undefined) todo.dateTime = new Date(dateTime);
            return todo.save();
        })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/add', (req, res) => {
    const { task, dateTime } = req.body;
    TodoModel.create({ task, dateTime: new Date(dateTime) })
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
