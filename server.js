const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '1234',
  database: 'TDE' 
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});


app.post('/create', (req, res) => {
  const { name, age } = req.body;
  const query = `INSERT INTO users (name, age) VALUES (?, ?)`;
  db.query(query, [name, age], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(`User created with ID: ${result.insertId}`);
  });
});

app.get('/users', (req, res) => {
  const query = `SELECT * FROM users`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

app.get('/users/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

app.put('/users/:id', (req, res) => {
  const { name, age } = req.body;
  const query = `UPDATE users SET name = ?, age = ? WHERE id = ?`;
  db.query(query, [name, age, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(`User updated.`);
  });
});

app.delete('/users/:id', (req, res) => {
  const query = `DELETE FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(`User deleted.`);
  });
});

const PORT = 6060;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});