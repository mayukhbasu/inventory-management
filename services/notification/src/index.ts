import express from 'express';
import bodyParser from "body-parser";
import { startConsumer } from './consumers/stockAlertConsumer';


const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({"test": "test"})
})
app.listen(port, async () => {
  console.log(`Application starting on port ${port}...`);
    try {
        await startConsumer();
        console.log("Consumer started.");
    } catch (error) {
        console.error("Failed to start the consumer:", error);
    }
});
