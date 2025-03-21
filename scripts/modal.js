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
    updateModal(number);
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
    const data = await fetchPokemonData(pokemonId); // Ruft Pokémon-Daten aus der API ab
    if (data) {
        const sprite = data.sprites.other.home.front_default;
        const name = data.name;
        const types = data.types.map(typeInfo => typeInfo.type.name).join(", ");
        const primaryType = data.types[0]?.type.name;
        const backgroundColor = modalTypeColors[primaryType] || "linear-gradient(to right, #DDDDDD, #FFFFFF)";

        // Hintergrundfarbe für modal-content setzen
        const modal = document.getElementById("pokemonModal");
        const modalContent = modal.querySelector(".modal-content");
        modalContent.style.background = backgroundColor;

        // Grundinformationen aktualisieren
        document.getElementById("modalSprite").src = sprite;
        document.getElementById("modalName").innerText = name;
        document.getElementById("modalNumber").innerText = `#${pokemonId}`;
        document.getElementById("modalTypes").innerText = types;

        // Zusätzliche Informationen anzeigen
        document.getElementById("height").innerText = `${data.height / 10} m`;
        document.getElementById("weight").innerText = `${data.weight / 10} kg`;
        
        // Tabelle für die Statistiken aktualisieren
        const statsBody = document.getElementById("stats-body");
        statsBody.innerHTML = ""; // Vorherige Inhalte löschen

        data.stats.forEach(stat => {
            const row = document.createElement("tr");

            const statNameCell = document.createElement("td");
            statNameCell.innerText = stat.stat.name; // Name des Werts (z. B. HP, Attack)

            const statValueCell = document.createElement("td");
            statValueCell.innerText = stat.base_stat; // Wert des Stats

            row.appendChild(statNameCell);
            row.appendChild(statValueCell);
            statsBody.appendChild(row);
        });

        // Beschreibung abrufen und anzeigen
        const description = await fetchPokemonDescription(pokemonId);
        const rightDetails = document.querySelector(".right-details");
        rightDetails.innerHTML = `<h3>Description</h3><p>${description}</p>`;

        modal.style.display = "flex"; // Modal sichtbar machen
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

async function fetchEvolutionData(pokemonId) {
    try {
        // Abruf der Spezies-Daten
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        if (!speciesResponse.ok) {
            throw new Error(`Fehler beim Abrufen der Spezies-Daten für ID ${pokemonId}`);
        }
        const speciesData = await speciesResponse.json();

        // Abruf der Evolutionskette
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) {
            throw new Error("Fehler beim Abrufen der Evolutionskette.");
        }
        const evolutionData = await evolutionResponse.json();
        return evolutionData.chain; // Rückgabe des Evolutionspfads
    } catch (error) {
        return null;
    }
}

function parseEvolutionChain(chain) {
    const evolutions = [];

    let currentStage = chain;
    while (currentStage) {
        evolutions.push(currentStage.species.name); // Name der aktuellen Spezies hinzufügen
        currentStage = currentStage.evolves_to[0]; // Nächste Evolutionsstufe
    }

    return evolutions; // Liste der Evolutionsstufen
}

async function fetchPokemonDescription(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = await response.json();

        // Filtere die Beschreibung in Englisch
        const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
        if (flavorTextEntry) {
            return flavorTextEntry.flavor_text
                .replace(/\n/g, " ")          // Ersetze Zeilenumbrüche durch Leerzeichen
                .replace(/\f/g, " ")          // Ersetze Seitenumbrüche (falls vorhanden)
                .replace(/↖|↗|↘|↙/g, "");   // Entferne Pfeile
        }
        return "No description available.";
    } catch (error) {
        return "No description is currently available for this Pokémon in the database.";
    }
}