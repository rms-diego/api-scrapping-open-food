import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/utils/errorMiddleware';

const app = express();
app.use(cors());

// error handling
app.use(errorMiddleware);

export { app };
