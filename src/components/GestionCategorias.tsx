import React, { useState, useEffect } from 'react';
import { Tag, Edit, Trash2 } from 'lucide-react';

interface Categoria {
  categoria_id: number;
  nombre_categoria: string;
}

const GestionCategorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState<string>('');
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/categorias');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las categorías');
      }
      const datos = await respuesta.json();
      setCategorias(datos);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const agregarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:5000/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_categoria: nuevaCategoria }),
      });
      if (!respuesta.ok) {
        throw new Error('Error al agregar la categoría');
      }
      setNuevaCategoria('');
      cargarCategorias();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... (rest of the component remains the same)

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Gestión de Categorías</h3>
      <form onSubmit={editandoCategoria ? editarCategoria : agregarCategoria} className="mb-4">
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={editandoCategoria ? editandoCategoria.nombre_categoria : nuevaCategoria}
          onChange={(e) =>
            editandoCategoria
              ? setEditandoCategoria({ ...editandoCategoria, nombre_categoria: e.target.value })
              : setNuevaCategoria(e.target.value)
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {editandoCategoria ? 'Actualizar Categoría' : 'Agregar Categoría'}
        </button>
        {editandoCategoria && (
          <button
            type="button"
            onClick={() => setEditandoCategoria(null)}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.categoria_id} className="mb-2 flex items-center">
            <Tag className="mr-2" size={18} />
            <span>
              <strong>{categoria.nombre_categoria}</strong>
            </span>
            <button
              onClick={() => setEditandoCategoria(categoria)}
              className="ml-2 text-blue-500"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => eliminarCategoria(categoria.categoria_id)}
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

export default GestionCategorias;