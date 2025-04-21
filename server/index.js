const express = require('express');
const app = express();
const userData = require('./sample.json');
const cors = require('cors');
const port = 8000;
const fs = require('fs');

app.use(cors({
  origin: "https://Logeshwaran06.github.io",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.get('/users', (req, res) => {
  return res.json(userData);
});

app.post('/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.age || !newUser.city) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const maxId = userData.reduce((max, user) => (user.id > max ? user.id : max), 0);
  newUser.id = maxId + 1;

  userData.push(newUser);

  fs.writeFile('./sample.json', JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add user!" });
    }
    return res.status(201).json(newUser);
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  const index = userData.findIndex(user => user.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "User not found!" });
  }

  userData[index] = { ...userData[index], ...updatedUser };

  fs.writeFile('./sample.json', JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user!" });
    }
    return res.status(200).json(userData[index]);
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const index = userData.findIndex(user => user.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "User not found!" });
  }

  userData.splice(index, 1);

  fs.writeFile('./sample.json', JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user!" });
    }
    return res.status(200).json(userData);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});