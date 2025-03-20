function openModal(number, name, sprite, types) {
    currentPokemonId = number; // Aktuelle Pokémon-ID speichern

    // Extrahiere den ersten Typ
    const primaryType = types.split(", ")[0];
    const backgroundColor = modalTypeColors[primaryType] || "linear-gradient(to right, #DDDDDD, #FFFFFF)";

    // Aktualisiere das Modal
    const modal = document.getElementById("pokemonModal");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.style.background = backgroundColor; // Hintergrundfarbe des modal-content setzen

    document.getElementById("modalSprite").src = sprite;
    document.getElementById("modalName").innerText = name;
    document.getElementById("modalNumber").innerText = `#${number}`;
    document.getElementById("modalTypes").innerText = types;

    modal.style.display = "flex"; // Modal anzeigen
}

document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("pokemonModal");
    modal.style.display = "none";
});

window.onclick = (event) => {
    const modal = document.getElementById("pokemonModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

async function lastPokemon() {
    currentPokemonId = currentPokemonId === 1 ? maxPokemon : currentPokemonId - 1; 
    await updateModal(currentPokemonId);
}

async function nextPokemon() {
    currentPokemonId = currentPokemonId === maxPokemon ? 1 : currentPokemonId + 1; 
    await updateModal(currentPokemonId);
}

async function updateModal(pokemonId) {
    const data = await fetchPokemonData(pokemonId); // Funktion, die Pokémon-Daten lädt
    if (data) {
        const sprite = data.sprites.other.home.front_default;
        const name = data.name;
        const types = data.types.map(typeInfo => typeInfo.type.name).join(", ");
        
        // Extrahiere den ersten Typ
        const primaryType = data.types[0]?.type.name;
        const backgroundColor = modalTypeColors[primaryType] || "linear-gradient(to right, #DDDDDD, #FFFFFF)";

        // Aktualisiere das Modal
        const modal = document.getElementById("modalContent");
        modal.style.background = backgroundColor; // Hintergrundfarbe setzen
        document.getElementById("modalSprite").src = sprite;
        document.getElementById("modalName").innerText = name;
        document.getElementById("modalNumber").innerText = `#${pokemonId}`;
        document.getElementById("modalTypes").innerText = types;

    } else {
        console.error("Fehler beim Laden der Pokémon-Daten.");
    }
}

const modalTypeColors = {
    fire: "linear-gradient(30deg, #F08030, #F5AC78)",
    water: "linear-gradient(30deg, #6890F0, #98D8D8)",
    grass: "linear-gradient(30deg, #78C850, #A7DB8D)",
    electric: "linear-gradient(30deg, #F8D030, #FAE078)",
    normal: "linear-gradient(30deg, #A8A878,rgb(213, 213, 186))",
    ground: "linear-gradient(30deg, #E0C068, #F5DEB3)",
    rock: "linear-gradient(30deg, #B8A038, #D1C17D)",
    psychic: "linear-gradient(30deg, #F85888, #FA92B2)",
    ice: "linear-gradient(30deg, #98D8D8, #D8F0F8)",
    dark: "linear-gradient(30deg, #705848, #A29288)",
    fairy: "linear-gradient(30deg, #EE99AC,rgb(252, 204, 214))",
    dragon: "linear-gradient(30deg, #7038F8, #A27DFA)",
    flying: "linear-gradient(30deg, #A890F0, #C6B7F5)",
    bug: "linear-gradient(30deg, #A8B820,rgb(207, 217, 128))",
    ghost: "linear-gradient(30deg, #705898,rgb(179, 163, 204))",
    poison: "linear-gradient(30deg, #A040A0,rgb(215, 151, 215))",
    steel: "linear-gradient(30deg, #B8B8D0, #D1D1E0)",
    fighting: "linear-gradient(30deg,rgb(120, 52, 39),rgb(199, 138, 135))"
};

