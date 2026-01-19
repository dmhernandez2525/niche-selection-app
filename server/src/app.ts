import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { nicheRouter } from './routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', nicheRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
