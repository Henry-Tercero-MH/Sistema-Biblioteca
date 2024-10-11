import React, { useState, useEffect } from 'react';
import { Calendar, Book, User, Check, X } from 'lucide-react';

interface Prestamo {
  prestamo_id: number;
  usuario_id: number;
  libro_id: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
}

const GestionPrestamos: React.FC = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState<Omit<Prestamo, 'prestamo_id' | 'fecha_devolucion'>>({
    usuario_id: 0,
    libro_id: 0,
    fecha_prestamo: '',
  });

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/prestamos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los préstamos');
      }
      const datos = await respuesta.json();
      setPrestamos(datos);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const agregarPrestamo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:5000/api/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPrestamo),
      });
      if (!respuesta.ok) {
        throw new Error('Error al agregar el préstamo');
      }
      setNuevoPrestamo({
        usuario_id: 0,
        libro_id: 0,
        fecha_prestamo: '',
      });
      cargarPrestamos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const marcarDevuelto = async (id: number) => {
    try {
      const respuesta = await fetch(`http://localhost:5000/api/prestamos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha_devolucion: new Date().toISOString().split('T')[0] }),
      });
      if (!respuesta.ok) {
        throw new Error('Error al marcar como devuelto');
      }
      cargarPrestamos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Gestión de Préstamos</h3>
      <form onSubmit={agregarPrestamo} className="mb-4">
        <input
          type="number"
          placeholder="ID del Usuario"
          value={nuevoPrestamo.usuario_id || ''}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, usuario_id: parseInt(e.target.value) })}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="ID del Libro"
          value={nuevoPrestamo.libro_id || ''}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, libro_id: parseInt(e.target.value) })}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="date"
          placeholder="Fecha de Préstamo"
          value={nuevoPrestamo.fecha_prestamo}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, fecha_prestamo: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Agregar Préstamo
        </button>
      </form>
      <ul>
        {prestamos.map((prestamo) => (
          <li key={prestamo.prestamo_id} className="mb-2 flex items-center">
            <Calendar className="mr-2" size={18} />
            <span>
              <strong>Usuario ID: {prestamo.usuario_id}</strong> - Libro ID: {prestamo.libro_id}
            </span>
            <span className="ml-2">
              Préstamo: {prestamo.fecha_prestamo} | Devolución: {prestamo.fecha_devolucion || 'Pendiente'}
            </span>
            {!prestamo.fecha_devolucion && (
              <button
                onClick={() => marcarDevuelto(prestamo.prestamo_id)}
                className="ml-2 text-blue-500"
              >
                Marcar como devuelto
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionPrestamos;