let startIndex = 1; 
const limit = 35; 
const maxPokemon = 151;

async function inIt() {
    await loadMorePokemon();
}

async function fetchPokemonData(pokemonId) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen von Pokémon mit der ID ${pokemonId}`);
        }
        const data = await response.json();
        return data;
}

async function renderPokemon(pokemonId) {
    const data = await fetchPokemonData(pokemonId);
    if (data) {
        const sprite = data.sprites.other.home.front_default;
        const number = data.id;
        const name = data.name;
        const types = data.types.map(typeInfo => typeInfo.type.name).join(", ");

        render(sprite, number, name, types);
    }
}

function render(sprite, number, name, types) {
    const registerElements = document.getElementById("content");
    const { primaryColor, secondaryColor } = splitColors(types);
    const html = `
        <div class="registerElement" onclick="openModal(${number}, '${name}', '${sprite}', '${types}')">
            <img class="sprites" src="${sprite}" alt="${name} Sprite">
            <input type="text" value="#${number}" placeholder="Nummer">
            <input type="text" value="${name}" placeholder="Name">
            <input type="text" value="${types}" placeholder="Typ" style="background: linear-gradient(to right, ${primaryColor}, ${secondaryColor});">
        </div>
    `;
    registerElements.innerHTML += html;
}

function splitColors(types) {
    const typeList = types.split(", ");
    const primaryColor = typeColors[typeList[0]] || "#DDDDDD";
    const secondaryColor = typeList[1] ? typeColors[typeList[1]] : primaryColor;
    return { primaryColor, secondaryColor };
}

const typeColors = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    normal: "#A8A878",
    ground: "#E0C068",
    rock: "#B8A038",
    psychic: "#F85888",
    ice: "#98D8D8",
    dark: "#705848",
    fairy: "#EE99AC",
    dragon: "#7038F8",
    flying: "#A890F0",
    bug: "#A8B820",
    ghost: "#705898",
    poison: "#A040A0",
    steel: "#B8B8D0",
    fighting: "#C03028"
};

async function loadMorePokemon() {
    const endIndex = Math.min(startIndex + limit - 1, maxPokemon);
    for (let pokemonId = startIndex; pokemonId <= endIndex; pokemonId++) {
        await renderPokemon(pokemonId);
    }
    startIndex += limit;
    if (startIndex > maxPokemon) {
        document.getElementById("loadMore").disabled = true;
    }
}

document.getElementById("loadMore").addEventListener("click", loadMorePokemon);

