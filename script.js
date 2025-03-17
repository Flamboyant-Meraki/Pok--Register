async function inIt() {
    for (let pokemonId = 1; pokemonId <= 40; pokemonId++) {
        await renderPokemon(pokemonId);
    }
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
