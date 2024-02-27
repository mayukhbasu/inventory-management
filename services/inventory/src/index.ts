import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';


import inventoryRouter from './routes/inventory-route';
import bodyParser from "body-parser";
import { startScheduledTask } from './utils/scheduler';

const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient();

startScheduledTask();
app.use(bodyParser.json());
app.use(cors());
app.use('/inventory', inventoryRouter)
app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
