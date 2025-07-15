const url = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
let pokemon_list = document.getElementById("pokemons");
const detailPokemonId = document.getElementById("detailPokemonId");
const searchInput = document.getElementById("searchInput");
const pokemonAlreadyLoaded = [];
let offset = 0;
const limit = 25;


function init() {
  loadMore(); 
  searchInput.addEventListener("input", searchPokemon);
}


async function loadMore() {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "block";
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    const promises = data.results.map(pokemon => detailPokemon(pokemon));
    const newPokemon = await Promise.all(promises);
    loade(newPokemon);
    offset += limit;
  } catch (error) {
    console.error("Fehler beim Laden weiterer Pokemon:", error);
    alert("Fehler beim Laden weiterer Pokémon.");
  } finally {
    spinner.style.display = "none";
  }
}



function loade(newPokemon){
  newPokemon.forEach(pokemon => {
      document.getElementById("pokemons").innerHTML += templateRenderPokemon(pokemon);
    });
}



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
  const input = searchInput.value.toLowerCase();
  const spinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const loadMoreButton = document.getElementById("loadMoreButton");

  spinner.style.display = "block";
  errorMessage.style.display = "none";
  errorMessage.innerText = "";

  if (input.length > 0) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }
  setTimeout(() => {
    const filteredPokemon = Object.entries(pokemonAlreadyLoaded)
      .filter(([name]) => name.toLowerCase().includes(input))
      .sort(([, a], [, b]) => a.id - b.id); 

    if (filteredPokemon.length > 0) {
      const renderedHTML = filteredPokemon
        .map(([, pokemon]) => templateRenderPokemon(pokemon))
        .join("");

      pokemon_list.innerHTML = renderedHTML;
    } else {
      pokemon_list.innerHTML = "";
      errorMessage.innerText = "❌ Kein Pokémon gefunden!";
      errorMessage.style.display = "block";
      loadMoreButton.style.display = "none";
    }

    spinner.style.display = "none";
  }, 800);
}

