let startIndex = 1; 
const limit = 40; 
const maxPokemon = 151;

async function inIt() {
    // Initial: Lade die ersten 40 Pokémon
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
    const html = `
        <div class="registerElement">
            <img class="sprites" src="${sprite}" alt="${name} Sprite">
            <input type="text" value="#${number}" placeholder="Nummer">
            <input type="text" value="${name}" placeholder="Name">
            <input type="text" value="${types}" placeholder="Typ">
        </div>
    `;
    if (registerElements) {
        registerElements.innerHTML += html;
    } else {
        console.error("Element mit der ID 'content' wurde nicht gefunden.");
    }
}

async function loadMorePokemon() {
    // Berechne die End-ID für die aktuelle Ladung
    const endIndex = Math.min(startIndex + limit - 1, maxPokemon);

    // Lade Pokémon im Bereich [startIndex, endIndex]
    for (let pokemonId = startIndex; pokemonId <= endIndex; pokemonId++) {
        await renderPokemon(pokemonId);
    }

    // Aktualisiere den Startindex für die nächste Ladung
    startIndex += limit;

    // Deaktiviere den Button, wenn alle Pokémon geladen wurden
    if (startIndex > maxPokemon) {
        document.getElementById("loadMore").disabled = true;
    }
}

document.getElementById("loadMore").addEventListener("click", loadMorePokemon);

