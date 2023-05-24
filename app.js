const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3500;

const nicheSelection = require('./nicheSelection');

app.get('/select-niche', async (req, res) => {
  try {
    const niches = await nicheSelection.selectNiche();
    res.json(niches);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while selecting niches.');
  }
});

app.get('/', (req, res) => {
  res.send('Niche Selection App');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
