import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import logo from './images/logo.ico';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Asegúrate de tener la configuración de Firebase

// Páginas o componentes
import Carreras from './pages/carreras';
import Login from './pages/login';
import Register from './pages/Register';
import Inicio from './pages/inicio';
import AdminDashboard from './pages/AdminDashboard';
import Contacto from './pages/contacto';

// Importa los iconos de react-icons
import { FaHome, FaChalkboardTeacher, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCog } from 'react-icons/fa';

function App() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es admin
  const [userLoaded, setUserLoaded] = useState(false); // Estado para verificar si los datos del usuario están cargados

  // Verifica si el usuario está autenticado y obtiene el rol
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);

        // Obtener el rol del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.rol === 'admin'); // Verifica si el rol es admin
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false); // Si no está autenticado, no es admin
      }

      setUserLoaded(true); // Los datos del usuario han sido cargados
    });

    // Limpieza del evento de autenticación
    return () => unsubscribe();
  }, [auth]);

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setIsAdmin(false); // Resetear estado de admin al cerrar sesión
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <div className="App">
      <Helmet>
        <title>Futuro Conecta</title>
        <link rel="icon" href="images/logo.ico" type="image/x-icon" />
      </Helmet>

      {/* Header y Navbar */}
      <header>
        <nav>
          <div className="logo">
            <img src={logo} alt="Logo Futuro Conecta" />
          </div>
          <ul>
            <li><Link to="/"><FaHome /> Inicio</Link></li>
            {isAuthenticated && <li><Link to="/carreras"><FaChalkboardTeacher /> Carreras</Link></li>} {/* Solo visible si está autenticado */}
            <li><Link to="/contacto"><FaEnvelope /> Contacto</Link></li>

            {isAuthenticated ? (
              <>
                {isAdmin && <li><Link to="/AdminDashboard"><FaCog /> Admin Dashboard</Link></li>} {/* Solo visible para admin */}
                <li><Link to="#" onClick={handleSignOut}><FaSignOutAlt /> Cerrar sesión</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login"><FaSignInAlt /> Login</Link></li>
                <li><Link to="/register"><FaUserPlus /> Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carreras" element={<Carreras />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Ruta para AdminDashboard protegida */}
        <Route 
          path="/AdminDashboard" 
          element={userLoaded ? (isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/" />) : <Navigate to="/" />} 
        />
      </Routes>

      {/* Footer */}
      {/*<footer id="footering">
        <div>
          <p>&copy; 2024 Futuro Conecta. Todos los derechos reservados.</p>
        </div>
      </footer>*/}
    </div>
  );
}

export default App;
