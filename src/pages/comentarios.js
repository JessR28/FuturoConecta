// Importa las dependencias necesarias
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Importa Firestore
import { db } from '../firebaseConfig'; // Importa tu configuración de Firebase
import './comentarios.css';

function MostrarComentarios() {
  const [mensajes, setMensajes] = useState([]); // Estado para almacenar los comentarios

  // Función para obtener los mensajes desde Firestore
  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mensajes')); // Obtiene la colección 'mensajes'
        const mensajesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMensajes(mensajesData); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error('Error obteniendo los mensajes:', error);
      }
    };

    obtenerMensajes();
  }, []);

  return (
    <div>
      {/* Contenedor de mensajes */}
      <div className="container my-5" style={{ paddingTop: '80px' }}>
        <h2 className="text-center mb-4">Mensajes de Usuarios</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Correo Electrónico</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {mensajes.length > 0 ? (
                mensajes.map((mensaje, index) => (
                  <tr key={mensaje.id}>
                    <td>{index + 1}</td>
                    <td>{mensaje.email || 'Correo no proporcionado'}</td>
                    <td>{mensaje.mensaje || 'Sin mensaje'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay mensajes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MostrarComentarios;
