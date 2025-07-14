const url = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
let pokemon_list = document.getElementById("pokemons");
const detailPokemonId = document.getElementById("detailPokemonId");
const searchInput = document.getElementById("searchInput");
const pokemonAlreadyLoaded = [];
let offset = 0;
const limit = 20;


function init() {
  loadMore(); // statt renderPokemon
  searchInput.addEventListener("input", searchPokemon);
}

async function renderPokemon() {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "block";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const promises = data.results.map((pokemon) => detailPokemon(pokemon));
    const allPokemon = await Promise.all(promises);
    pokemon_list.innerHTML = "";
    allPokemon.forEach((detailpokemon) => {
      pokemon_list.innerHTML += templateRenderPokemon(detailpokemon); });
  } catch (error) {
    console.error("Failed to load Pokémon:", error);
    alert("Something went wrong while loading Pokémon.");
  } finally {
    spinner.style.display = "none";} }



async function detailPokemon(pokemon) {
  if (pokemonAlreadyLoaded[pokemon.name]) {
    return pokemonAlreadyLoaded[pokemon.name];
  } else {
    const response = await fetch(pokemon.url);
    const detailData = await response.json();
    pokemonAlreadyLoaded[pokemon.name] = detailData;
    return detailData;
  }
}


async function ShowPokemonById(id) {
  if (!id) return;
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "block";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }

    const detailpokemon = await response.json();
    detailPokemonId.innerHTML = templateRenderDetailPokemon(detailpokemon);
    popupElement();
  } catch (error) {
    console.error(error);
    alert("Pokemon not found!");
  } finally {
    spinner.style.display = "none";
  }
}


function popupElement() {
  document.getElementById("detailPokemonId").classList.add("popup_active");
}


function close_popup(event) {
  document.getElementById("detailPokemonId").classList.toggle("popup_active");
  event.stopPropagation();
}


function stop_event(event) {
  event.stopPropagation();
}


function prev(id, event) {
  const newId = id > 1 ? id - 1 : 100;
  ShowPokemonById(newId);
  event.stopPropagation();
}


function next(id, event) {
  const newId = id < 100 ? id + 1 : 1;
  ShowPokemonById(newId);
  event.stopPropagation();
}


function searchPokemon() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const spinner = document.getElementById("loadingSpinner");

  spinner.style.display = "block";

  setTimeout(() => {
    pokemon_list.innerHTML = "";

    for (let name in pokemonAlreadyLoaded) {
      if (name.toLowerCase().includes(input)) {
        const pokemon = pokemonAlreadyLoaded[name];
        pokemon_list.innerHTML += templateRenderPokemon(pokemon);
      }
    }

    spinner.style.display = "none";
  }, 1000);
}



async function loadMore() {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "block";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const promises = data.results.map(pokemon => detailPokemon(pokemon));
    const newPokemon = await Promise.all(promises);

    newPokemon.forEach(pokemon => {
      document.getElementById("pokemons").innerHTML += templateRenderPokemon(pokemon);
    });

    offset += limit;
  } catch (error) {
    console.error("Fehler beim Laden weiterer Pokémon:", error);
    alert("Fehler beim Laden weiterer Pokémon.");
  } finally {
    spinner.style.display = "none";
  }
}
