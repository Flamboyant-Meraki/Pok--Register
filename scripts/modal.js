function openModal(number, name, sprite, types) {
    const modal = document.getElementById("pokemonModal");
    document.getElementById("modalSprite").src = sprite;
    document.getElementById("modalName").innerText = `${name}`;
    document.getElementById("modalNumber").innerText = `#${number}`;
    document.getElementById("modalTypes").innerText = `${types}`;

    modal.style.display = "flex";
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