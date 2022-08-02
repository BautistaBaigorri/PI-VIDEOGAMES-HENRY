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
  // defino el modelo para VIDEOGAME
  // modelName / attributes / options
  sequelize.define(
    "videogame",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      platforms: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    { timestamps: true, createdAt: "creado", updatedAt: false }
  );
};
