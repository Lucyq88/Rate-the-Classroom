// Load ratings from localStorage
const ratings = JSON.parse(localStorage.getItem("ratings")) || [];
const listDiv = document.getElementById("list");

if (ratings.length === 0) {
    listDiv.innerHTML = "<p>No ratings have been submitted yet.</p>";
} else {
    ratings.forEach(rate => {
        const item = document.createElement("div");
        item.classList.add("rating-entry");

        item.innerHTML = `
            <div class="rating-card">
                <h3>${rate.building} — Room ${rate.room}</h3>
                <p><strong>Overall Rating:</strong> ${rate.rating}/5</p>
                <p><strong>Lighting:</strong> ${rate.lighting}/5</p>
                <p class="timestamp">${new Date(rate.timestamp).toLocaleString()}</p>
            </div>
        `;

        listDiv.appendChild(item);
    });
}
