import { Router } from 'express';
import pool from '../db.js';
import requireAuth from '../middleware/requireAuth.js';

var router = Router();

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
    console.error('=== Error Details ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', error);
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  req.session.destroy((err) => {
    res.clearCookie("notes.sid");
    res.redirect('/login');
  });
})

export default router;