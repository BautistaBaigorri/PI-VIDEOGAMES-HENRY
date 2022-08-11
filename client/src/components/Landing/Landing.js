import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="MyImage">
      <img className="theImage" src="" alt="" />
      <h1 className="myTitle">¡BIENVENIDO A TU APP FAVORITA DE VIDEOJUEGOS!</h1>
      <Link to="/videogames">
        <button className="myButton">PLAY NOW</button>
      </Link>
    </div>
  );
}
