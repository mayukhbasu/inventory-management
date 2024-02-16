import express from 'express';
import { query } from './config/db';


const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const result = await query('SELECT NOW() as now');
  res.json({ currentTime: result.rows[0].now });
});



app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
