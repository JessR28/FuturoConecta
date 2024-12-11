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
import Comentarios from './pages/comentarios';
import AdminDashboard from './pages/adminDashboard';
import Gastronomia from './pages/gastronomia';
import Tecnologias from './pages/tecnologias';
import Biotecnologia from './pages/biotecnologia';

// Iconos de react-icons
import { FaHome, FaChalkboardTeacher, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCog } from 'react-icons/fa';

// Componente para proteger rutas
const ProtectedRoute = ({ isAuthenticated, isAdmin, children, redirectTo = "/login" }) => {
  if (!isAuthenticated) return <Navigate to={redirectTo} />;
  if (isAdmin === false && redirectTo === "/adminDashboard") return <Navigate to="/" />; // Redirigir si no es admin
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
        console.log("Usuario autenticado:", user);
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Datos del usuario:", userData);
            setIsAdmin(userData.rol === 'admin');
          } else {
            console.log("El documento del usuario no existe en Firestore.");
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error al obtener el documento del usuario:", error);
          setIsAdmin(false);
        }
      } else {
        console.log("Usuario no autenticado");
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
            {!isAuthenticated && <li><Link to="/"><FaHome /> Inicio</Link></li>}
            {isAuthenticated && <li><Link to="/carreras"><FaChalkboardTeacher /> Carreras</Link></li>}
            
            {isAuthenticated ? (
              <>
                <li><Link to="/comentarios"><FaCog /> Comentarios</Link></li>
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
        
        {/* Ruta protegida de AdminDashboard */}
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Rutas protegidas para usuarios autenticados */}
        <Route
          path="/comentarios"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Comentarios />
            </ProtectedRoute>
          }
        />
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
      </Routes>
    </div>
  );
}

export default App;
