import React, { useState, useEffect } from 'react';
import { Book, Edit, Trash2 } from 'lucide-react';

interface Libro {
  libro_id: number;
  titulo: string;
  autor: string;
  fecha_publicacion: string;
  categoria_id: number;
}

const GestionLibros: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [nuevoLibro, setNuevoLibro] = useState<Omit<Libro, 'libro_id'>>({
    titulo: '',
    autor: '',
    fecha_publicacion: '',
    categoria_id: 0,
  });
  const [editandoLibro, setEditandoLibro] = useState<Libro | null>(null);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/libros');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los libros');
      }
      const datos = await respuesta.json();
      setLibros(datos);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const agregarLibro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:5000/api/libros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoLibro),
      });
      if (!respuesta.ok) {
        throw new Error('Error al agregar el libro');
      }
      setNuevoLibro({
        titulo: '',
        autor: '',
        fecha_publicacion: '',
        categoria_id: 0,
      });
      cargarLibros();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... (rest of the component remains the same)

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Gestión de Libros</h3>
      <form onSubmit={editandoLibro ? editarLibro : agregarLibro} className="mb-4">
        <input
          type="text"
          placeholder="Título"
          value={editandoLibro ? editandoLibro.titulo : nuevoLibro.titulo}
          onChange={(e) =>
            editandoLibro
              ? setEditandoLibro({ ...editandoLibro, titulo: e.target.value })
              : setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={editandoLibro ? editandoLibro.autor : nuevoLibro.autor}
          onChange={(e) =>
            editandoLibro
              ? setEditandoLibro({ ...editandoLibro, autor: e.target.value })
              : setNuevoLibro({ ...nuevoLibro, autor: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="date"
          placeholder="Fecha de Publicación"
          value={editandoLibro ? editandoLibro.fecha_publicacion : nuevoLibro.fecha_publicacion}
          onChange={(e) =>
            editandoLibro
              ? setEditandoLibro({ ...editandoLibro, fecha_publicacion: e.target.value })
              : setNuevoLibro({ ...nuevoLibro, fecha_publicacion: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Categoría ID"
          value={editandoLibro ? editandoLibro.categoria_id : nuevoLibro.categoria_id}
          onChange={(e) =>
            editandoLibro
              ? setEditandoLibro({ ...editandoLibro, categoria_id: parseInt(e.target.value) })
              : setNuevoLibro({ ...nuevoLibro, categoria_id: parseInt(e.target.value) })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {editandoLibro ? 'Actualizar Libro' : 'Agregar Libro'}
        </button>
        {editandoLibro && (
          <button
            type="button"
            onClick={() => setEditandoLibro(null)}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>
      <ul>
        {libros.map((libro) => (
          <li key={libro.libro_id} className="mb-2 flex items-center">
            <Book className="mr-2" size={18} />
            <span>
              <strong>{libro.titulo}</strong> por {libro.autor} - Publicado: {libro.fecha_publicacion}, Categoría: {libro.categoria_id}
            </span>
            <button
              onClick={() => setEditandoLibro(libro)}
              className="ml-2 text-blue-500"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => eliminarLibro(libro.libro_id)}
              className="ml-2 text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionLibros;