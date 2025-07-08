// دالة العرض المنفصلة (أفضل للأداء)
function templateRenderPokemon(detailpokemon) {
  return `
        <div class="card m-1">
            <div class="card-header bg-secondary text-white">
                <span class="fst-normal fs-6">
                    #${detailpokemon.id} - ${detailpokemon.name.toUpperCase()}
                </span>
            </div>
            <div class="card-body ${detailpokemon.types[0]?.type.name} text-center">
                <img src="${detailpokemon.sprites.other.dream_world.front_default ||  './img/pokemon_logo.png'}" class="card-img-top image" alt="image pokemon ${detailpokemon.name}">
            </div>
            <div class="card-body text-center bg-info-subtle">
                ${detailpokemon.types.map((type) =>  
                    `<span class="badge text-bg-danger">${type.type.name}</span>`
                ).join(' ')}
            </div>
        </div>
    `;
}