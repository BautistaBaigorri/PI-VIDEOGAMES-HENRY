const { Router } = require("express");
const axios = require("axios");
const { Videogame, Genre } = require("../db");

// Importar todos los routers;

const router = Router();

const url = "f6b1ea75c3e247c1b04182b77c466218";

// Creo funciones controladoras
/* 
dataApi: me traigo toda la informacion de la API, con los datos necesarios que me requieren en la ruta principal.

dataBase: me traigo la informacion de la base de datos
include -> incluime el modelo Genre, yo quiero que me traigas todos los videojuegos pero ademas que me incluyas el modelo Genre, y de este modelo traeme el siguiente atributo (name).
el through es una comprobacion que se hace cuando yo quiero traer tal atributo. (significa mediante los atributos)

allVideogames: concatenar todo y devolverlo
*/
const dataApi = async () => {
  try {
    // const url = "f6b1ea75c3e247c1b04182b77c466218";
    const apiUrl = await axios.get(
      `https://api.rawg.io/api/games?key=${url}&page=1&page_size=40`
    );
    const apiUrl2 = await axios.get(
      `https://api.rawg.io/api/games?key=${url}&page=2&page_size=40`
    );
    const apiUrl3 = await axios.get(
      `https://api.rawg.io/api/games?key=${url}&page=3&page_size=20`
    );

    await Promise.all([apiUrl, apiUrl2, apiUrl3]).then((data) => {
      apiResult = data[0].data.results
        .concat(data[1].data.results)
        .concat(data[2].data.results);
    });

    const apiInfo = await apiResult.map((g) => {
      return {
        id: g.id,
        name: g.name,
        image: g.background_image,
        rating: g.rating,
        genres: g.genres.map((g) => g.name),
      };
    });
    return apiInfo;
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------------------------------

const dataBase = async () => {
  return await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

//------------------------------------------------------------------

const allVideogames = async () => {
  const apiInfo = await dataApi();
  const dbInfo = await dataBase();
  const allInfo = apiInfo.concat(dbInfo);
  return allInfo;
};

//==================================================================

// Creo las rutas
/*
en la ruta get de videogames y de videogames?name=...
voy a unificar y voy hacer todo en la misma
*/
router.get("/videogames", async (req, res) => {
  const name = req.query.name;
  const totalVideogames = await allVideogames();
  if (name) {
    let nameVg = await totalVideogames.filter((n) =>
      n.name.toLowerCase().includes(name.toLowerCase())
    );
    nameVg.length
      ? res.status(200).send(nameVg)
      : res.status(404).send("No se encuentra el juego");
  } else {
    res.status(200).send(totalVideogames);
  }
});

//------------------------------------------------------------------

router.get("/videogame/:id", async (req, res) => {
  const { id } = req.params;

  let juegos = await allVideogames(); // traigo todos los videojuegos

  let idd = Number(id) ? Number(id) : id;
  /* 
  let idd = Si se puede convertir en numero el id es porque es un juego de la API sino porque es un juego de DB, si se convierte en numero idd, se va a guardar el id convertido en numero sino el string (UUID).

  const x = Se va fijar si el id que paso por params coincide con el id de la API o de la DB, en el array de todos los juegos (let juegos).
  */
  const x = juegos.find((i) => i.id === idd);

  if (!x) res.send("El id es incorrecto"); // si no esta -> error

  if (typeof idd === "number") {
    /* 
    Si mi id es de tipo numero, se que mi juego es de la API, hago la peticion y me traigo el juego de la API, y lo guardo en (let gameApi). Saco la info que me requiere en la ruta de detalle del front y retorno el juego con su informacion. Sino, busco un videojuego en la DB, lo parseo, y en la propiedad genres lo mapeo para quedarme solo con los valores y no con la prop. Finalmente retorno 
    */
    let gameApi = await axios.get(
      `https://api.rawg.io/api/games/${idd}?key=${url}`
    );

    let juego = gameApi.data;

    juego = {
      id: juego.id,
      name: juego.name,
      img: juego.background_image,
      genres: juego.genres.map((i) => i.name),
      description: juego.description,
      releaseDate: juego.released,
      rating: juego.rating,
      platforms: juego.platforms.map((i) => i.platform.name),
    };

    res.send(juego);
  } else {
    let videogameDb = await Videogame.findOne({
      where: {
        id: idd,
      },
      include: Genre,
    });

    videogameDb = JSON.stringify(videogameDb);
    videogameDb = JSON.parse(videogameDb);

    videogameDb.genres = videogameDb.genres.map((i) => i.name);

    res.send(videogameDb);
  }
});

//------------------------------------------------------------------

/*
En const genres -> me traigo todos los generos de la API
let generos -> es un array results en donde estan todos los generos
Luego en generos voy a hacer un map y me voy a traer el name
Le hago un forEach a generos para que itere por el mismo, en donde voy a buscar o crear dentro del Genre el nombre del genero.
const allGenres -> voy a buscar todos los los generos creados y lo guardo en la variable
Finalmente la retorno
*/
router.get("/genres", async (req, res) => {
  const genres = await axios.get(`https://api.rawg.io/api/genres?key=${url}`);
  let generos = genres.data.results;

  generos = generos.map((i) => i.name);

  generos.forEach((g) => {
    Genre.findOrCreate({
      where: {
        name: g,
      },
    });
  });

  const allGenres = await Genre.findAll();

  res.status(200).send(allGenres);
});

//------------------------------------------------------------------
/*
Primero me traigo todo lo que quiero que me llegue por body
Luego creo una const que me cree un videogame con las propiedades que requiera, excepto el genero
Luego me paro en la posicion 0 del videojuego que se creó y le agrego los generos(genres)
Finalmente envio un mensaje de que fue creado correctamente

addGenres es un metodo de sequelize que basicamente lo que hace es traerme de la tabla Genre aquello que le estoy pasando por invocación
*/
router.post("/videogames", async (req, res, next) => {
  try {
    const { name, description, releaseDate, rating, platforms, genres } =
      req.body;
    const videoGameCreate = await Videogame.findOrCreate({
      where: {
        name,
        description,
        releaseDate,
        rating,
        platforms,
      },
    });

    await videoGameCreate[0].addGenre(genres);

    res.send("El videojuego fue creado correctamente");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
