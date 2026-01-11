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
    
    // Login successful - set session data
    // Store user information in the session
    req.session.user = {
      id: user.id,
      email: user.email
    };
    
    // Session is automatically saved to MySQL database by express-session
    // Redirect to notes page after successful login
    res.redirect('/notes');
    
  } catch (error) {
    next(error);
  }
});


router.get('/notes', function(req, res, next) {
  res.render('notes')
})


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

router.get('/api/notes', async (req, res, next) => {
 // Check if user is logged in
 if (req.session.user) {
  // User is logged in - access user info
  const userId = req.session.user.id;
  const userEmail = req.session.user.email;
  res.render('notes', { user: req.session.user });
} else {
  // User not logged in - redirect to login
  res.redirect('/login');
}
})

router.post('/api/notes', async (req, res, next) => {

})

router.get('/api/notes/:noteId', async (req, res, next) => {
  
})

router.delete('/api/notes/:noteId', async (req, res, next) => {
  
})


router.post('/api/logout', async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
})

export default router;
