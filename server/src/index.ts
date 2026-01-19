import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 3500;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
