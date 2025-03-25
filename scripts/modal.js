function openModal(number, name, sprite, types) {
    currentPokemonId = number; 
    setModalBackground(types);
    setModalContent(number, name, sprite, types);
    showModal();
    updateModal(number); 
}

function setModalBackground(types) {
    const primaryType = types.split(", ")[0];
    const backgroundColor = modalTypeColors[primaryType] || "linear-gradient(to right, #DDDDDD, #FFFFFF)";
    const modalContent = document.querySelector("#pokemonModal .modal-content");
    modalContent.style.background = backgroundColor;
}

function setModalContent(number, name, sprite, types) {
    document.getElementById("modalSprite").src = sprite;
    document.getElementById("modalName").innerText = name;
    document.getElementById("modalNumber").innerText = `#${number}`;
    document.getElementById("modalTypes").innerText = types;
}

function showModal() {
    const modal = document.getElementById("pokemonModal");
    modal.style.display = "flex"; 
}

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("pokemonModal").style.display = "none";
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
    const data = await fetchPokemonData(pokemonId);
    if (data) {
        updateModalAppearance(data);
        updateModalStats(data);
        await updateModalDescription(pokemonId);
    }
}

function updateModalAppearance(data) {
    const { name, height, weight, sprites, types } = data;
    const sprite = sprites.other.home.front_default;
    const primaryType = types[0]?.type.name;
    const backgroundColor = modalTypeColors[primaryType] || "linear-gradient(to right, #DDDDDD, #FFFFFF)";
    const modalContent = document.querySelector("#pokemonModal .modal-content");
    modalContent.style.background = backgroundColor;
    document.getElementById("modalSprite").src = sprite;
    document.getElementById("modalName").innerText = name;
    document.getElementById("modalNumber").innerText = `#${data.id}`;
    document.getElementById("modalTypes").innerText = types.map(t => t.type.name).join(", ");
    document.getElementById("height").innerText = `${height / 10} m`;
    document.getElementById("weight").innerText = `${weight / 10} kg`;
}

function updateModalStats(data) {
    const statsBody = document.getElementById("stats-body");
    statsBody.innerHTML = ""; 

    data.stats.forEach(stat => {
        const row = document.createElement("tr");
        const statNameCell = document.createElement("td");
        statNameCell.innerText = stat.stat.name;
        const statValueCell = document.createElement("td");
        statValueCell.innerText = stat.base_stat;
        row.appendChild(statNameCell);
        row.appendChild(statValueCell);
        statsBody.appendChild(row);
    });
}

async function updateModalDescription(pokemonId) {
    const description = await fetchPokemonDescription(pokemonId);
    const rightDetails = document.querySelector(".right-details");
    rightDetails.innerHTML = `<h3>Description</h3><p>${description}</p>`;
}

async function fetchPokemonDescription(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = await response.json();
        const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");

        if (flavorTextEntry) {
            return flavorTextEntry.flavor_text
                .replace(/\n/g, " ")
                .replace(/\f/g, " ")
                .replace(/↖|↗|↘|↙/g, "");
        }

        return "No description available.";
    } catch (error) {
        return "No description is currently available for this Pokémon in the database.";
    }
}