import { Router } from 'express';
import pool from '../db.js';
import requireAuth from '../middleware/requireAuth.js';

var router = Router();

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

export default router;
