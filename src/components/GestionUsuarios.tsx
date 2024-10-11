import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2 } from 'lucide-react';

interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  email: string;
}

const GestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, 'usuario_id'>>({
    nombre_usuario: '',
    email: '',
  });
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/usuarios');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los usuarios');
      }
      const datos = await respuesta.json();
      setUsuarios(datos);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const agregarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...nuevoUsuario, contraseña: 'defaultPassword' }), // You should implement a proper password input
      });
      if (!respuesta.ok) {
        throw new Error('Error al agregar el usuario');
      }
      setNuevoUsuario({ nombre_usuario: '', email: '' });
      cargarUsuarios();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... (rest of the component remains the same)

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Gestión de Usuarios</h3>
      <form onSubmit={editandoUsuario ? editarUsuario : agregarUsuario} className="mb-4">
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={editandoUsuario ? editandoUsuario.nombre_usuario : nuevoUsuario.nombre_usuario}
          onChange={(e) =>
            editandoUsuario
              ? setEditandoUsuario({ ...editandoUsuario, nombre_usuario: e.target.value })
              : setNuevoUsuario({ ...nuevoUsuario, nombre_usuario: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={editandoUsuario ? editandoUsuario.email : nuevoUsuario.email}
          onChange={(e) =>
            editandoUsuario
              ? setEditandoUsuario({ ...editandoUsuario, email: e.target.value })
              : setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {editandoUsuario ? 'Actualizar Usuario' : 'Agregar Usuario'}
        </button>
        {editandoUsuario && (
          <button
            type="button"
            onClick={() => setEditandoUsuario(null)}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.usuario_id} className="mb-2 flex items-center">
            <User className="mr-2" size={18} />
            <span>
              <strong>{usuario.nombre_usuario}</strong> - {usuario.email}
            </span>
            <button
              onClick={() => setEditandoUsuario(usuario)}
              className="ml-2 text-blue-500"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => eliminarUsuario(usuario.usuario_id)}
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

export default GestionUsuarios;