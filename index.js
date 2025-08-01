const express = require('express');
const { Pool } = require('pg');
const app = express();

const users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" },
  { username: "user3", password: "pass3" },
  { username: "user4", password: "pass4" },
  { username: "user5", password: "pass5" }
];

const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware para parsear JSON y formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Página principal con hora desde la base de datos
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Bienvenido a MyEcoShop. Hora actual: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al conectar con la base de datos.');
  }
});

// Mostrar formulario de login
app.get('/login', (req, res) => {
  res.send(`
    <h2>Login MyEcoShop</h2>
    <form method="POST" action="/login">
      <label>Usuario: <input type="text" name="username" /></label><br/>
      <label>Contraseña: <input type="password" name="password" /></label><br/>
      <button type="submit">Entrar</button>
    </form>
  `);
});

// Procesar login (desde formulario o JSON)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send(`<h3>Login exitoso. ¡Bienvenido, ${username}!</h3><a href="/login">Volver</a>`);
  } else {
    res.status(401).send(`<h3>Usuario o contraseña incorrectos.</h3><a href="/login">Intentar de nuevo</a>`);
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
