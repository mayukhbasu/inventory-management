import express from 'express';
import bodyParser from "body-parser";
import orderRouter from './routes/order-route';


const app = express();
const port = process.env.PORT || 3002;
app.use(bodyParser.json());
app.use('/', orderRouter);
app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
