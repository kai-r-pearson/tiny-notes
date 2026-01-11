import { Router } from 'express';
import pool from '../db.js';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
