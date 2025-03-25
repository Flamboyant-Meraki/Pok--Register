let startIndex = 1; 
const limit = 35; 
const maxPokemon = 151;

document.getElementById("loadMore").addEventListener("click", loadMorePokemon);

async function inIt() {
    await loadMorePokemon();
}

async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen von Pokémon mit der ID ${pokemonId}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
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
    const html = createTemplate(sprite, number, name, types, primaryColor, secondaryColor);

    registerElements.innerHTML += html;
}

function createTemplate(sprite, number, name, types, primaryColor, secondaryColor) {
    return `
        <div class="registerElement" onclick="openModal(${number}, '${name}', '${sprite}', '${types}')">
            <img class="sprites" src="${sprite}" alt="${name} Sprite">
            <input type="text" value="#${number}" placeholder="Nummer">
            <input type="text" value="${name}" placeholder="Name">
            <input type="text" value="${types}" placeholder="Typ" style="background: linear-gradient(to right, ${primaryColor}, ${secondaryColor});">
        </div>
    `;
}

function splitColors(types) {
    const typeList = types.split(", ");
    const primaryColor = typeColors[typeList[0]] || "#DDDDDD";
    const secondaryColor = typeList[1] ? typeColors[typeList[1]] : primaryColor;
    return { primaryColor, secondaryColor };
}

async function loadMorePokemon() {
    showLoadingScreen(); 
    const endIndex = calculateEndIndex();
    await loadBatch(startIndex, endIndex);
    updateStartIndex();
    disableButtonIfNoMorePokemon();
    hideLoadingScreen(); 
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "flex";
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none";
}

function calculateEndIndex() {
    return Math.min(startIndex + limit - 1, maxPokemon);
}

async function loadBatch(start, end) {
    for (let pokemonId = start; pokemonId <= end; pokemonId++) {
        await renderPokemon(pokemonId); 
    }
}

function updateStartIndex() {
    startIndex += limit; 
}

function disableButtonIfNoMorePokemon() {
    if (startIndex > maxPokemon) {
        document.getElementById("loadMore").disabled = true;
    }
}

function filterPokemon() {
    const input = document.getElementById("search-bar").value.toLowerCase();
    const pokemonElements = document.querySelectorAll(".registerElement");
    pokemonElements.forEach(element => {
        const onClickValue = element.getAttribute("onclick"); 
        const name = onClickValue.match(/'([^']+)'/)[1].toLowerCase(); 

        if (name.includes(input)) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
}