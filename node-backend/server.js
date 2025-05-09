const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://vip:venkat123@cluster0.twvburi.mongodb.net/crudapp?retryWrites=true&w=majority&appName=Cluster0');

const User = mongoose.model('User', { name: String });

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/users', async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.send(user);
});

// Serve Angular static files
app.use(express.static(path.join(__dirname, 'dist/angular-frontend')));

// Catch-all route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
