const url = "https://pokeapi.co/api/v2/pokemon";
let pokemon_list = document.getElementById("pokemons");
const pokemonAlreadyLoaded = {};


function init(){
    renderPokemon()

}


async function renderPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
  const data = await response.json();
  data.results.forEach(detailPokemon);
}


async function detailPokemon(pokemon) {
  let detailpokemon;
  if(pokemonAlreadyLoaded[pokemon.name]){
    detailpokemon = pokemonAlreadyLoaded[pokemon.name];
  }else{
    const detailResponse = await fetch(pokemon.url);
    if (!detailResponse.ok) {
      throw new Error(`Could not fetch data for ${pokemon.name}`);
    }
    detailpokemon = await detailResponse.json();
    pokemonAlreadyLoaded[pokemon.name] = detailpokemon;
  }
  pokemon_list.innerHTML += templateRenderPokemon(detailpokemon);
  
}




