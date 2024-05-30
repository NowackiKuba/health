import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = 8080;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
