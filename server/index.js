const express = require('express');
const app = express();
const userData = require('./sample.json'); // Load the JSON file
const cors = require('cors');
const port = 8000;
const fs = require('fs');

app.use(cors());
app.use(express.json());

// GET all users
app.get('/users', (req, res) => {
  return res.json(userData);
});

// POST (Add a new user)
app.post('/users', (req, res) => {
  const newUser = req.body;

  // Validate input
  if (!newUser.name || !newUser.age || !newUser.city) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Generate a unique ID
  const maxId = userData.reduce((max, user) => (user.id > max ? user.id : max), 0);
  newUser.id = maxId + 1;

  // Add the new user
  userData.push(newUser);

  // Save to the JSON file
  fs.writeFile('./sample.json', JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add user!" });
    }
    return res.status(201).json(newUser);
  });
});

// PUT (Update an existing user)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  // Find the user by ID
  const index = userData.findIndex(user => user.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "User not found!" });
  }

  // Update the user
  userData[index] = { ...userData[index], ...updatedUser };

  // Save to the JSON file
  fs.writeFile('./sample.json', JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user!" });
    }
    return res.status(200).json(userData[index]);
  });
});

// DELETE (Remove a user)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // Find the user by ID
  const index = userData.findIndex(user => user.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "User not found!" });
  }

  // Remove the user
  userData.splice(index, 1);

  // Save to the JSON file
  fs.writeFile('./sample.json', JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user!" });
    }
    return res.status(200).json(userData);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});