import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar-div">
      <NavLink to="/">
        <button>Principal</button>
      </NavLink>
      <NavLink to="/videogames">
        <button>Juegos</button>
      </NavLink>
      <NavLink to="/crearjuego">
        <button>CrearJuego</button>
      </NavLink>
      <NavLink to="/about">
        <button>SobreMi</button>
      </NavLink>
    </div>
  );
}

export default NavBar;
