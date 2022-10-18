import 'dotenv/config';

import 'express-async-errors';
import express from 'express';
import { resolve } from 'path';
import Youch from 'youch';
import cors from 'cors';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    console.log('Loading routes...');

    this.middlewares();
    this.routes();
    this.exceptionHandler();

    console.timeLog('Load time');
    console.log('Load complete');
  }

  middlewares() {
    if (process.env.NODE_ENV == 'development') {
      this.server.use(cors());
    } else {
      this.server.use(cors({ origin: process.env.FRONTEND_URL }));
    }
    this.server.use(express.json());
    this.server.use(
      '/file',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/asset',
      express.static(resolve(__dirname, 'app', 'views', 'assets'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV == 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
