import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './login.css';
import { useNavigate, Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      setError('Por favor, ingrese ambos campos (Correo y Contraseña).');
      return;
    }

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario registrado:', userCredential.user);

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.rol === 'admin') {
          navigate('/AdminDashboard');
        } else {
          navigate('/carreras');
        }
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('No se pudo iniciar sesión. Verifique sus credenciales e inténtelo nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Inicia sesión</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            title="Por favor, ingresa tu correo electrónico."
          />
          <label className="login-label" htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            title="Por favor, ingresa tu contraseña."
          />
          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
