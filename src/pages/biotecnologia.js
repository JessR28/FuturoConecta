import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './carreraDetalle.css';

const Biotecnologia = () => {
  const [convenios, setConvenios] = useState([]);
  const [nuevoConvenio, setNuevoConvenio] = useState({
    unidadProductiva: '',
    ubicacion: '',
    nombreResponsable: '',
    telefono: '',
    correo: '',
    logo: '', // Campo para guardar la imagen en base64
  });
  const [editando, setEditando] = useState(false);  // Indica si estamos editando un convenio
  const [convenioEditadoId, setConvenioEditadoId] = useState(null); // ID del convenio que estamos editando

  // Obtener datos de convenios desde Firestore
  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'biotecnologia_convenios'));
        const conveniosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setConvenios(conveniosData);
      } catch (error) {
        console.error('Error al obtener los convenios:', error);
      }
    };

    fetchConvenios();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoConvenio({ ...nuevoConvenio, [name]: value });
  };

  // Manejar la subida de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setNuevoConvenio((prevState) => ({
        ...prevState,
        logo: reader.result, // Guardar la imagen como base64
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Registrar un nuevo convenio
  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        // Si estamos editando, actualizamos el convenio
        const convenioRef = doc(db, 'biotecnologia_convenios', convenioEditadoId);
        await updateDoc(convenioRef, nuevoConvenio);
        setConvenios(convenios.map(convenio => convenio.id === convenioEditadoId ? { ...convenio, ...nuevoConvenio } : convenio));
        setEditando(false);
        setConvenioEditadoId(null);
        alert('Convenio actualizado con éxito');
      } else {
        // Si no estamos editando, agregamos un nuevo convenio
        await addDoc(collection(db, 'biotecnologia_convenios'), nuevoConvenio);
        setConvenios([...convenios, nuevoConvenio]);
        alert('Convenio registrado con éxito');
      }

      setNuevoConvenio({
        unidadProductiva: '',
        ubicacion: '',
        nombreResponsable: '',
        telefono: '',
        correo: '',
        logo: '',
      });
    } catch (error) {
      console.error('Error al registrar o actualizar el convenio:', error);
    }
  };

  // Editar un convenio
  const handleEditar = (convenio) => {
    setNuevoConvenio(convenio);  // Prellenamos el formulario con los datos del convenio seleccionado
    setEditando(true);  // Indicamos que estamos en modo edición
    setConvenioEditadoId(convenio.id);  // Guardamos el ID del convenio a editar
  };

  // Eliminar un convenio
  const handleEliminar = async (id) => {
    try {
      const convenioRef = doc(db, 'biotecnologia_convenios', id);
      await deleteDoc(convenioRef);  // Eliminamos el convenio de Firestore
      setConvenios(convenios.filter(convenio => convenio.id !== id));  // Actualizamos la lista de convenios
      alert('Convenio eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el convenio:', error);
    }
  };

  return (
    <div className="carrera-detalle">
      <h1>Convenios de Biotecnología</h1>

      {/* Tabla de convenios */}
      <table className="tabla-convenios">
        <thead>
          <tr>
            <th>Unidad Productiva</th>
            <th>Ubicación</th>
            <th>Nombre Responsable</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Logo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {convenios.length > 0 ? (
            convenios.map((convenio, index) => (
              <tr key={index}>
                <td>{convenio.unidadProductiva}</td>
                <td>{convenio.ubicacion}</td>
                <td>{convenio.nombreResponsable}</td>
                <td>{convenio.telefono}</td>
                <td>{convenio.correo}</td>
                <td>
                  {convenio.logo && (
                    <img
                      src={convenio.logo}
                      alt="Logo"
                      style={{ maxWidth: '100px', height: 'auto' }}
                    />
                  )}
                </td>
                <td>
                  <button className="btn-accion editar" onClick={() => handleEditar(convenio)}>
                    Editar
                  </button>
                  <button className="btn-accion eliminar" onClick={() => handleEliminar(convenio.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                No hay convenios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Formulario para registrar o editar un convenio */}
      <form className="formulario-convenio" onSubmit={handleRegistrar}>
      <h2>Registrar nuevo Convenio de Biotecnología</h2>
        <input
          type="text"
          name="unidadProductiva"
          placeholder="Unidad Productiva"
          value={nuevoConvenio.unidadProductiva}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={nuevoConvenio.ubicacion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombreResponsable"
          placeholder="Nombre Responsable"
          value={nuevoConvenio.nombreResponsable}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={nuevoConvenio.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo Electrónico"
          value={nuevoConvenio.correo}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {nuevoConvenio.logo && (
          <div style={{ margin: '20px 0' }}>
            <img
              src={nuevoConvenio.logo}
              alt="Vista previa del logo"
              style={{ maxWidth: '150px', height: 'auto' }}
            />
          </div>
        )}
        <button type="submit" className="btn-registrar">
          {editando ? 'Actualizar Convenio' : 'Registrar Convenio'}
        </button>
      </form>
    </div>
  );
};

export default Biotecnologia;
