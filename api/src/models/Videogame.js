const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
/* 
Los models se utiliza para crear instancias de tablas. 
Para crearlos se va a utilizar el objeto sequelize que hemos definido al comienzo.
  
El objeto sequelize es un objeto que cuenta con muchos metodos, para crear tablas se va utilizar el metodo 'define'. En donde como primer parametro va a recibir una string con el nombre del modelo, y como segundo parametro entre llaves escribiremos todos los atributos con sus respectivas propiedades u opciones.

Atributos: En base al objeto DataTypes que requerimos de sequelize, nos va a permitir definir el tipo de dato que aceptarara el atributo.

UUID: Es un numero único que se utiliza como identifiacor.
UUIDV4: Hace que el id a generar sea hexadecimal
Se usa para que no se pisen el id de la API con los de la tabla
allowNull: false -> no te permito que esté vacio por lo tanto significa que ese campo es requerido  
 */
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "videogame",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      platforms: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // Lo creamos con array ya que un videojuego puese ser jugado en varias plataformas
        allowNull: false,
      },
      createdAtDb: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Esta propiedad nos separa los vg q creamos nosotros y los que vienen en la bd, a la hora de buscarlos o filtarlos lo vamos a buscar con esta propiedad antes que con el ID.
    },
    {
      timestamps: false,
    }
  );
};
