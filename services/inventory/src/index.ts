import express from 'express';
import { greet } from "myLib";

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(greet('World'));
});



app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
