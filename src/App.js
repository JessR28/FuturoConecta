import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import logo from './images/logo.ico';
import { getAuth, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Páginas o componentes
import Carreras from './pages/carreras';
import Login from './pages/login';
import Register from './pages/register';
import Inicio from './pages/inicio';
import AdminDashboard from './pages/adminDashboard';
import Contacto from './pages/contacto';
import Gastronomia from './pages/gastronomia';
import Tecnologias from './pages/tecnologias';
import Biotecnologia from './pages/biotecnologia'; 

// Iconos de react-icons
import { FaHome, FaChalkboardTeacher, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCog } from 'react-icons/fa';

// Componente para proteger rutas
const ProtectedRoute = ({ isAuthenticated, children, redirectTo = "/login" }) => {
  if (!isAuthenticated) return <Navigate to={redirectTo} />;
  return children;
};

// Componente para rutas exclusivas de administrador
const AdminRoute = ({ isAuthenticated, isAdmin, children }) => {
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  // Verificar autenticación y roles del usuario
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.rol === 'admin');
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setUserLoaded(true);
    });
    return () => unsubscribe();
  }, [auth]);

  // Cerrar sesión
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setIsAdmin(false);
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

      {/* Navbar */}
      <header>
        <nav>
          <div className="logo">
            <img src={logo} alt="Logo Futuro Conecta" />
          </div>
          <ul>
            {!isAuthenticated && <li><Link to="/"><FaHome /> Inicio</Link></li>} {/* Solo se muestra si no está autenticado */}
            {isAuthenticated && <li><Link to="/carreras"><FaChalkboardTeacher /> Carreras</Link></li>}
            <li><Link to="/contacto"><FaEnvelope /> Contacto</Link></li>
            {isAuthenticated ? (
              <>
                {isAdmin && <li><Link to="/AdminDashboard"><FaCog /> Admin Dashboard</Link></li>}
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
        <Route path="/contacto" element={<Contacto />} />
        
        {/* Rutas protegidas para usuarios autenticados */}
        <Route 
          path="/carreras" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Carreras />
            </ProtectedRoute>
          } 
        />

        {/* Rutas dinámicas de las carreras */}
        <Route 
          path="/carrera/gastronomia" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Gastronomia />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/carrera/tecnologias" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tecnologias />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/carrera/biotecnologia" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Biotecnologia />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta exclusiva para administradores */}
        <Route 
          path="/AdminDashboard" 
          element={
            <AdminRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
