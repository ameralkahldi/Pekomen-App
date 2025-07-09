const url = "https://pokeapi.co/api/v2/pokemon";
let pokemon_list = document.getElementById("pokemons");
let loadMoreBtn = document.getElementById('loadmore');
let searchInput = document.getElementById("input_search");
const mainContain = document.getElementById("main");
const loading = document.getElementById("loading");
const detailPokemonId = document.getElementById("detailPokemonId");
const pokemonAlreadyLoaded = {};


function init(){
    renderPokemon()
    ShowPokemonById()

}


async function renderPokemon() {
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach(detailPokemon);
}


async function detailPokemon(pokemon) {
  let detailpokemon;
  if(pokemonAlreadyLoaded[pokemon.name]){
    detailpokemon = pokemonAlreadyLoaded[pokemon.name];
  }else{
    const detailResponse = await fetch(pokemon.url)
    detailpokemon = await detailResponse.json();
    pokemonAlreadyLoaded[pokemon.name] = detailpokemon;
  }
  pokemon_list.innerHTML += templateRenderPokemon(detailpokemon);
  
}

async function ShowPokemonById(id) {
  const container = document.getElementById("pokemon_list");
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok || response.status === 404)
      throw new Error("Pokemon not found");
    const detailpokemon = await response.json();
    detailPokemonId.innerHTML = templateRenderDetailPokemon(detailpokemon);
  popupElement()}
  

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


