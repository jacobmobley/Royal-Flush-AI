const express = require('express');
const app = express();
const port = 5000;
const path = require("path");

// Example GET endpoint
app.get('/api/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontpage.html'));
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});