import { mostrarPokemon } from "./view.js";

const listaPokemon = document.querySelector("#listaPokemon");

const botonesHeader = document.querySelectorAll(".btn-header");

let URL = "https://pokeapi.co/api/v2/pokemon/";

let pokemons;

async function load(afterLoadEach, typeId, offset) {
  let urls;
  if (typeId) {
    let url = `https://pokeapi.co/api/v2/type/${typeId}`;
    let response = await fetch(url);
    let data = await response.json();
    urls = data.pokemon
      .slice(offset)
      .slice(0, 1008)
      .map((poke) => poke.pokemon.url);
  } else {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=${offset}`;
    let response = await fetch(url);
    let data = await response.json();
    urls = data.results.map((poke) => poke.url);
  }

  const promises = [];
  for (let url of urls) {
    let dataPromise = fetch(url).then((response) => response.json());
    //.then(afterLoadEach);
    promises.push(dataPromise);
  }
  let pokemons = await Promise.all(promises);
  pokemons.forEach(afterLoadEach);
}

load((poke) => mostrarPokemon(poke));

botonesHeader.forEach((boton) =>
  boton.addEventListener("click", (event) => {
    const typeId = event.currentTarget.dataset.typeId;

    listaPokemon.innerHTML = "";
    if (typeId) {
      window.location.hash = `#${typeId}`;
      load(mostrarPokemon, typeId, 0);
    } else {
      window.location.hash = "#";
      load(mostrarPokemon, null, 0);
    }
  })
);
window.loadMore = () => {
  const typeId = window.location.hash.slice(1);
  const offset = document.querySelectorAll(".pokemon").length;
  load(mostrarPokemon, typeId, offset);
};
