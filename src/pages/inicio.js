// src/pages/Inicio.js
import React from 'react';

import './inicio.css'; // Asegúrate de tener este archivo para los estilos

const Inicio = () => {
  return (
    <section className="hero">
      <div className="hero-box">
        <h1>Bienvenido a Futuro Conecta</h1>
        <p>Explora y busca la mejor opción para realizar tus estadías profesionales</p>
        <button className="cta-button" onClick={() => window.location.href = '/carreras'}>Conoce</button>
      </div>
    </section>
  );
};

export default Inicio;
