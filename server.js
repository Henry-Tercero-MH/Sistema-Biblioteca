const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  user: "YOUR_USERNAME",
  password: "YOUR_PASSWORD",
  connectString: "YOUR_CONNECTION_STRING"
};

// Function to execute queries
async function executeQuery(sql, binds = [], options = {}) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(sql, binds, options);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Routes for USERS
app.post('/api/usuarios', async (req, res) => {
  const { nombre_usuario, email, contraseña } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await executeQuery(
      'INSERT INTO Usuarios (nombre_usuario, email, contraseña) VALUES (:1, :2, :3)',
      [nombre_usuario, email, hashedPassword]
    );
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios/login', async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  try {
    const users = await executeQuery(
      'SELECT * FROM Usuarios WHERE nombre_usuario = :1',
      [nombre_usuario]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const user = users[0];
    const validPassword = await bcrypt.compare(contraseña, user[2]); // Assuming password is at index 2
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    res.json({ mensaje: 'Inicio de sesión exitoso', usuario_id: user[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const users = await executeQuery('SELECT usuario_id, nombre_usuario, email FROM Usuarios');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for BOOKS
app.post('/api/libros', async (req, res) => {
  const { titulo, autor, fecha_publicacion, categoria_id } = req.body;
  try {
    await executeQuery(
      'INSERT INTO Libros (titulo, autor, fecha_publicacion, categoria_id) VALUES (:1, :2, :3, :4)',
      [titulo, autor, new Date(fecha_publicacion), categoria_id]
    );
    res.status(201).json({ mensaje: 'Libro agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/libros', async (req, res) => {
  try {
    const books = await executeQuery('SELECT * FROM Libros');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for CATEGORIES
app.post('/api/categorias', async (req, res) => {
  const { nombre_categoria } = req.body;
  try {
    await executeQuery(
      'INSERT INTO Categorias (nombre_categoria) VALUES (:1)',
      [nombre_categoria]
    );
    res.status(201).json({ mensaje: 'Categoría agregada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categorias', async (req, res) => {
  try {
    const categories = await executeQuery('SELECT * FROM Categorias');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for LOANS
app.post('/api/prestamos', async (req, res) => {
  const { usuario_id, libro_id, fecha_prestamo } = req.body;
  try {
    await executeQuery(
      'INSERT INTO Prestamos (usuario_id, libro_id, fecha_prestamo) VALUES (:1, :2, :3)',
      [usuario_id, libro_id, new Date(fecha_prestamo)]
    );
    res.status(201).json({ mensaje: 'Préstamo registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prestamos', async (req, res) => {
  try {
    const loans = await executeQuery('SELECT * FROM Prestamos');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${port}`);
});