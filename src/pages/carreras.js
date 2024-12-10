import React from 'react';
import { Link } from 'react-router-dom';
import './carreras.css';
import gastroImage from '../images/gastro.jpg';
import tiImage from '../images/ti.jpeg';
import bioImage from '../images/bio.jpg';

const Carreras = () => {
  return (
    <div className="carreras">
      <div className="carrera">
        <Link to="/carrera/gastronomia">
          <img src={gastroImage} alt="Gastronomía" />
          <p>Gastronomía</p>
        </Link>
      </div>

      <div className="carrera">
        <Link to="/carrera/tecnologias">
          <img src={tiImage} alt="Tecnologías" />
          <p>Tecnologías</p>
        </Link>
      </div>

      <div className="carrera">
        <Link to="/carrera/biotecnologia">
          <img src={bioImage} alt="Biotecnología" />
          <p>Biotecnología</p>
        </Link>
      </div>
    </div>
  );
};

export default Carreras;
