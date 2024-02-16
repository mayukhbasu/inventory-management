import express from 'express';
import inventoryRouter from './routes/inventory-route';
import bodyParser from "body-parser";


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/inventory', inventoryRouter)
app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
