import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { nicheRouter } from './routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', nicheRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
