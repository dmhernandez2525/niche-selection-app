// app.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3500;

const nicheSelection = require('./nicheSelection');

app.get('/select-niche', (req, res) => {
  const niches = nicheSelection.selectNiche();
  res.json(niches);
});

app.get('/', (req, res) => {
  res.send('Niche Selection App');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
