import { Router } from 'express';
import pool from '../db.js';
import requireAuth from '../middleware/requireAuth.js';
import loggedIn from '../middleware/loggedIn.js'

var router = Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { dbHealth: "connected" });
});

/* GET login page. */
router.get('/login', loggedIn, function(req, res, next) {
  // Check if the user is already logged in (has a session)
  res.render('login');
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



export default router;