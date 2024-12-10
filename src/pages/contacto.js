import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './contacto.css'; // Asegúrate de que los estilos estén bien aplicados

const Contacto = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        setEmail(user.email || '');
      } else {
        setUsuario(null);
        setEmail('');
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert('Debes estar logueado para enviar un mensaje');
      return;
    }

    if (!mensaje.trim()) {
      alert('El mensaje no puede estar vacío');
      return;
    }

    try {
      await addDoc(collection(db, 'mensajes'), {
        email,
        mensaje,
        usuarioId: usuario.uid,
        fecha: new Date(),
      });
      setMensaje('');
      navigate('/contacto'); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div className="contacto-container">
      <div className="contacto-box">
        <h2 className="contacto-title">Contáctanos</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="contacto-label">Correo Electrónico</label>
            <input
              type="email"
              className="contacto-input"
              id="email"
              value={email}
              readOnly // Campo no editable
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mensaje" className="contacto-label">Mensaje</label>
            <textarea
              className="contacto-textarea"
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className="contacto-button" disabled={!mensaje.trim()}>
            Enviar Mensaje
          </button>
        </form>
        {!usuario && <p className="text-danger mt-3">Debes iniciar sesión para enviar un mensaje.</p>}
      </div>
    </div>
  );
};

export default Contacto;
