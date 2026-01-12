import { Router } from 'express';
import pool from '../db.js';
import requireAuth from '../middleware/requireAuth.js';

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
    
    // Login successful - set session data
    // Store user information in the session
    req.session.userId = user.id;
    
    // Session is automatically saved to MySQL database by express-session
    // Redirect to notes page after successful login
    res.redirect('/notes');
    
  } catch (error) {
    next(error);
  }
});


router.get('/notes', requireAuth, function(req, res, next) {
  res.render('notes')
})


router.get('/health/db', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ ok: true, db: "connected" })
  } catch (error) {
    next(error);
  }
})

router.get('/api/notes', requireAuth, async (req, res, next) => {
  const [rows] = await pool.query(
    'SELECT * FROM notes WHERE user_id = ?', req.session.userId
  )
})

router.post('/api/notes', requireAuth, async (req, res, next) => {

})

router.get('/api/notes/:noteId', async (req, res, next) => {
  
})

router.delete('/api/notes/:noteId', async (req, res, next) => {
  
})


router.post('/api/logout', async (req, res, next) => {
  req.session.destroy((err) => {
    res.clearCookie("notes.sid");
    res.redirect('/login');
  });
})

export default router;
