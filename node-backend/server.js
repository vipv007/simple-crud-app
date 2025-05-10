// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/crudapp';
mongoose.connect(mongoURI, {
  // optional: use these if not already deprecated in your driver version
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({ name: String });
const User = mongoose.model('User', userSchema);

// ✅ GET /users - fetch all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ POST /users - add a new user
app.post('/users', async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
