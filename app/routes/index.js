import { Router } from 'express';
import pool from '../db.js';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { dbHealth: "connected" });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* POST login - handle login form submission */
router.post('/login', async function(req, res, next) {
  try {
    const { email } = req.body;
    
    // Check if email is provided
    if (!email) {
      return res.status(400).render('login', { error: 'Email is required' });
    }
    
    // Query database to find user by email
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    // Check if user exists
    if (rows.length === 0) {
      return res.status(401).render('login', { error: 'Invalid email' });
    }
    
    const user = rows[0];
    
    // Login successful - for now, just redirect to home
    // TODO: Set up session/cookie authentication
    res.redirect('/');
    
  } catch (error) {
    next(error);
  }
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/health/db', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ ok: true, db: "connected" })
  } catch (error) {
    next(error);
  }
})

export default router;
