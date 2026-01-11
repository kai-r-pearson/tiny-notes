import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const pool = createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
