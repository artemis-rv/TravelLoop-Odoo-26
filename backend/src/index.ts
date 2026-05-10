import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('TravelLoop API is running');
});

// TODO: Import and use module routes here

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
