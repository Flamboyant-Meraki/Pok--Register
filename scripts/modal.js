function render(sprite, number, name, types) {
    const registerElements = document.getElementById("content");
    const html = `
        <div class="registerElement" onclick="openModal(${number}, '${name}', '${sprite}', '${types}')">
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

function openModal(number, name, sprite, types) {
    const modal = document.getElementById("pokemonModal");
    document.getElementById("modalSprite").src = sprite;
    document.getElementById("modalName").innerText = `Name: ${name}`;
    document.getElementById("modalNumber").innerText = `ID: #${number}`;
    document.getElementById("modalTypes").innerText = `Types: ${types}`;

    modal.style.display = "block";
}

document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("pokemonModal");
    modal.style.display = "none";
});

// Optional: Schließe das Fenster, wenn der Benutzer außerhalb klickt
window.onclick = (event) => {
    const modal = document.getElementById("pokemonModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};