import express from 'express';
import bodyParser from "body-parser";


const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({"test": "test"})
})
app.listen(port, () => {
  console.log(`Service A listening at http://localhost:${port}`);
});
