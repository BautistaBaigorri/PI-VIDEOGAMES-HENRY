import axios from "axios";
import {
  GET_ALL_GAMES,
  SEARCH_BY_NAME,
  GET_VIDEOGAME_DETAIL,
  GET_GENRES,
  ORDER_BY,
  FILTER_BY,
} from "./constants";

//* Trae todos los juegos (DB + API)
export function getAllGames() {
  return async function (dispatch) {
    try {
      const res = await axios
        .get(`/videogames`);
      dispatch({ type: GET_ALL_GAMES, payload: res.data });
    } catch (err) {
      return err;
    }
  };
}

//* Trae todos los juegos encontrados por nombre (QUERY: "name")
export function searchByName(name) {
  return async function (dispatch) {
    try {
      const res = await axios
        .get(`/videogames?name=${name}`);
      dispatch({ type: SEARCH_BY_NAME, payload: res.data });
    } catch (err) {
      return err;
    }
  };
}

//* Trae los detalles del juego pasado por (params :ID)
export function getVideogameDetail(id) {
  return function (dispatch) {
    axios
      .get(`/videogame/${id}`)
      .then((res) => {
        dispatch({ type: GET_VIDEOGAME_DETAIL, payload: res.data });
      })
      .catch((err) => {
        return err;
      });
  };
}

//* Trae todos los generos
export function getGenres() {
  return function (dispatch) {
    axios
      .get('/genres')
      .then((res) => {
        dispatch({ type: GET_GENRES, payload: res.data });
      })
      .catch((err) => {
        return err;
      });
  };
}

//* Ordenamiento
export function orderBy(order) {
  return function (dispatch) {
    dispatch({ type: ORDER_BY, payload: order });
  };
}

//* Filtrado
export function filterBy(order) {
  return function (dispatch) {
    dispatch({ type: FILTER_BY, payload: order });
  };
}

// para que no me quede el estado anterior
export function clearDetails() {
  return {
    type: "CLEAR",
    payload: {}
  }
}