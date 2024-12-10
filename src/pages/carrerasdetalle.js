import React, { useState, useEffect } from 'react';
import './carreraDetalle.css';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';

const CarreraDetalle = ({ carrera }) => {
  const [convenios, setConvenios] = useState([]);
  const [nuevoConvenio, setNuevoConvenio] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editandoTexto, setEditandoTexto] = useState('');

  const conveniosRef = collection(db, `convenios_${carrera.toLowerCase()}`);

  useEffect(() => {
    const unsubscribe = onSnapshot(conveniosRef, (snapshot) => {
      const conveniosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConvenios(conveniosData);
    });
    return () => unsubscribe();
  }, [conveniosRef]);

  const agregarConvenio = async () => {
    if (nuevoConvenio.trim() === '') return;
    await addDoc(conveniosRef, { nombre: nuevoConvenio });
    setNuevoConvenio('');
  };

  const iniciarEdicion = (id, nombre) => {
    setEditandoId(id);
    setEditandoTexto(nombre);
  };

  const guardarEdicion = async () => {
    if (editandoTexto.trim() === '') return;
    const docRef = doc(db, `convenios_${carrera.toLowerCase()}`, editandoId);
    await updateDoc(docRef, { nombre: editandoTexto });
    setEditandoId(null);
    setEditandoTexto('');
  };

  const eliminarConvenio = async (id) => {
    const docRef = doc(db, `convenios_${carrera.toLowerCase()}`, id);
    await deleteDoc(docRef);
  };

  return (
    <div className="carrera-detalle">
      <h1>{carrera}</h1>
      <table>
        <thead>
          <tr>
            <th>Convenio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {convenios.map((convenio) => (
            <tr key={convenio.id}>
              <td>
                {editandoId === convenio.id ? (
                  <input
                    type="text"
                    value={editandoTexto}
                    onChange={(e) => setEditandoTexto(e.target.value)}
                  />
                ) : (
                  convenio.nombre
                )}
              </td>
              <td>
                {editandoId === convenio.id ? (
                  <button onClick={guardarEdicion}>Guardar</button>
                ) : (
                  <button onClick={() => iniciarEdicion(convenio.id, convenio.nombre)}>
                    Editar
                  </button>
                )}
                <button onClick={() => eliminarConvenio(convenio.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-convenio">
        <input
          type="text"
          placeholder="Nuevo convenio"
          value={nuevoConvenio}
          onChange={(e) => setNuevoConvenio(e.target.value)}
        />
        <button onClick={agregarConvenio}>Agregar</button>
      </div>
    </div>
  );
};

export default CarreraDetalle;
