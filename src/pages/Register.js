import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordValidation = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!passwordValidation.test(password)) {
      setError("La contraseña debe contener al menos una letra mayúscula y un carácter especial.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        email: user.email,
        rol: 'user',
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error("Error de registro:", err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Registrarse</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label className="register-label" htmlFor="email">Correo electrónico</label>
            <input
              className="register-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="register-label" htmlFor="password">Contraseña</label>
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="register-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="show-password-container">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Mostrar contraseña</label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button">Registrarse</button>
        </form>
        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
