import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './adminDashboard.css'; // Estilos del dashboard

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar el loading de la validación
  const navigate = useNavigate();
  const db = getFirestore();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkUserAuth = async () => {
      const user = auth.currentUser; // Obtener el usuario actual autenticado

      if (!user) {
        console.log('Usuario no autenticado, redirigiendo...');
        navigate('/login'); // Redirigir si no está autenticado
        return;
      }

      console.log('Usuario autenticado:', user.email);
      setLoading(false); // Termina el estado de carga
    };

    checkUserAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError(''); // Limpiar mensajes de error previos

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError('Este correo electrónico ya está en uso.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        email: user.email,
        role: 'user', // Asignamos el rol 'user' al registrar un nuevo usuario
      });

      console.log('Usuario registrado con éxito:', user.email);
      setLoading(false);
      navigate('/adminDashboard'); // Redirigir al dashboard de admin
    } catch (err) {
      setError(`Error al registrar el usuario: ${err.message}`);
      console.error('Error al registrar el usuario:', err); // Mostrar el error en la consola
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {/* Aquí puedes agregar contenido adicional para el Dashboard */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
        />
        <button type="submit">Registrar Usuario</button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdminDashboard;
