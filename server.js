const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// API endpoint to save credentials
app.post('/api/save-credentials', (req, res) => {
  console.log('Request received:', req.body);
  res.status(200).send('Credentials saved successfully');
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
