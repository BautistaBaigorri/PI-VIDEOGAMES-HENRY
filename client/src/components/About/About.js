import React from "react";
import NavBar from "../NavBar/NavBar";
import image from "../../img/about.png";
import "./About.css";

function About() {
  return (
    <>
      <NavBar />
      <div className="container-about">
        <h1>Proyecto Individual</h1>
        <h1>Bautista Baigorri</h1>
        <div className="div-foto">
          <img src={image} alt="foto"></img>
        </div>
      </div>
    </>
  );
}

export default About;
