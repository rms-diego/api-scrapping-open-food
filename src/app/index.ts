import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { errorMiddleware } from '@/middlewares/errorMiddleware';

import { routes } from '@/modules/openFoodScrapping/routes';

const app = express();

// app configuration
app.use(express.json()); // enable json use
app.use(express.urlencoded({ extended: true })); // enable www-form-urlencoded use
app.use(cors()); // cors middleware
app.use(morgan('dev')); // http logs
app.use(helmet()); // secure headers

// app routes
app.use(routes);

// error handling
app.use(errorMiddleware);

export { app };
