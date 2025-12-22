const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'max_verstappen_super_max_33';

const pool = new Pool({
  user: 'postgres',
  host: 'db', 
  database: 'kamusdb',
  password: 'password123',
  port: 5432,
});

const connectDb = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT NOW()');
      console.log('Database Connected!');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS words (
          id SERIAL PRIMARY KEY,
          term VARCHAR(100),
          definition TEXT,
          pronunciation VARCHAR(100),
          example TEXT,
          created_by VARCHAR(100) -- Kita tambah kolom ini biar tau siapa yg nulis
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role VARCHAR(20) DEFAULT 'user'
        )
      `);
      break;
    } catch (err) {
      console.log('Database belum siap, retrying...', retries);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};
connectDb();

// middelwarenya
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Regis
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).send("Username sudah dipakai / Error");
  }
});

// login bng
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(400).send("User tidak ditemukan");

    const user = result.rows[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET);
      res.json({ token, username: user.username, role: user.role });
    } else {
      res.status(403).send("Password salah");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/words', async (req, res) => {
  const result = await pool.query('SELECT * FROM words ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/words', async (req, res) => {
  const { term, definition, pronunciation, example } = req.body;
  const result = await pool.query(
    'INSERT INTO words (term, definition, pronunciation, example) VALUES ($1, $2, $3, $4) RETURNING *',
    [term, definition, pronunciation, example]
  );
  res.json(result.rows[0]);
});

app.put('/words/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { term, definition, pronunciation, example } = req.body;
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Hanya Admin yang boleh mengedit." });
  }

  try {
    const result = await pool.query(
      'UPDATE words SET term=$1, definition=$2, pronunciation=$3, example=$4 WHERE id=$5 RETURNING *',
      [term, definition, pronunciation, example, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal mengupdate data");
  }
});

app.delete('/words/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Hanya Admin yang boleh menghapus." });
  }

  try {
    await pool.query('DELETE FROM words WHERE id=$1', [id]);
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus data");
  }
});

app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});