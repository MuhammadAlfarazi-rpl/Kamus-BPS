const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Database (host 'db' merujuk pada nama service di docker-compose)
const pool = new Pool({
  user: 'postgres',
  host: 'db', 
  database: 'kamusdb',
  password: 'password123',
  port: 5432,
});

// Init Table jika belum ada
pool.query(`
  CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    term VARCHAR(100),
    definition TEXT,
    pronunciation VARCHAR(100),
    example TEXT
  )
`);

// API: Ambil semua kata
app.get('/words', async (req, res) => {
  const result = await pool.query('SELECT * FROM words ORDER BY id DESC');
  res.json(result.rows);
});

// API: Tambah kata baru
app.post('/words', async (req, res) => {
  const { term, definition, pronunciation, example } = req.body;
  const result = await pool.query(
    'INSERT INTO words (term, definition, pronunciation, example) VALUES ($1, $2, $3, $4) RETURNING *',
    [term, definition, pronunciation, example]
  );
  res.json(result.rows[0]);
});

app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});