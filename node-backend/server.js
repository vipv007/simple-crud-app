// server.js
// This is your existing server code that handles both API routes and serves the Angular frontend.
// Ensure this file is at the root of your deployment package.

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- MongoDB Connection ---
// IMPORTANT: For production, it's highly recommended to use environment variables
// for your database connection string instead of hardcoding it.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vip:venkat123@cluster0.twvburi.mongodb.net/crudapp?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Consider exiting the process if the DB connection fails and is critical
    // process.exit(1);
  });

// --- Mongoose User Model ---
const User = mongoose.model('User', {
  name: String
  // Add other fields as necessary
});

// --- API Routes ---
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Error fetching users', error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    // Basic validation: Check if name is provided
    if (!req.body.name) {
      return res.status(400).send({ message: 'User name is required.' });
    }
    const user = new User({ name: req.body.name });
    await user.save();
    res.status(201).send(user); // Send 201 Created status for new resources
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Error creating user', error: error.message });
  }
});

// --- Serve Angular Static Files ---
// IMPORTANT: Ensure 'angular-frontend' matches the actual output directory name
// from your 'ng build' command (e.g., inside the 'dist' folder).
const angularAppPath = path.join(__dirname, 'dist', 'angular-frontend');
app.use(express.static(angularAppPath));

// --- Catch-all Route to index.html (for Angular Routing) ---
// This ensures that any route not matched by static files or API routes
// will serve the main Angular application, allowing client-side routing to take over.
app.get('*', (req, res) => {
  const indexPath = path.join(angularAppPath, 'index.html');
  // Check if index.html exists to prevent errors if the build is missing
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // This part usually indicates a misconfiguration or missing build.
    console.error(`index.html not found at ${indexPath}. Check your Angular build and paths.`);
    res.status(404).send(`
      <h1>Application Error</h1>
      <p>The main application file (index.html) was not found.</p>
      <p>Please check server configuration and ensure the frontend application is correctly built and deployed to the 'dist/angular-frontend' directory.</p>
      <p>Expected path: ${indexPath}</p>
    `);
  }
});

// --- Server Port Configuration ---
const PORT = process.env.PORT || 5000; // Azure App Service will set the PORT environment variable.

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving Angular app from: ${angularAppPath}`);
  // Sanity check for Angular dist path
  const fs = require('fs');
  if (!fs.existsSync(angularAppPath)) {
    console.warn(`Warning: Angular distribution path not found at ${angularAppPath}. Ensure your 'ng build' output is correctly placed.`);
  }
});
