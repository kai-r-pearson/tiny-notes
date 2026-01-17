import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import apiRouter from './routes/api.js';
import usersRouter from './routes/users.js';
import pageRouter from './routes/pages.js';
import authRouter from './routes/auth.js';

import session from 'express-session';
import dotenv from 'dotenv';
import mysqlSession from 'express-mysql-session';

import pool from './db.js';

dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure MySQL session store
// express-mysql-session needs session passed to it (factory pattern)
const MySQLStore = mysqlSession(session, pool);

async function initializeMySQLStore(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const sessionStore = new MySQLStore({
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      
      // Test the connection
      await sessionStore.query('SELECT 1');
      console.log('MySQL session store connected successfully');
      return sessionStore;
    } catch (err) {
      console.log(`MySQL connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Failed to connect to MySQL after multiple retries');
}


initializeMySQLStore()
  .then(sessionStore => {
    // Configure session middleware
    app.use(session({
      name: "notes.sid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        secure: false,   // Set to true only with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      }}
    ));
    
    app.use('/', pageRouter);
    app.use('/', authRouter);
    app.use('/users', usersRouter);
    app.use('/api', apiRouter);

    app.use((req, res, next) => {
      next(createError(404));
    });

    app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.render('error');
    });
  })
  
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });




export default app;
