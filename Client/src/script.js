const app = document.getElementById("app");

let properties = [];

// Base API URL
const API_URL = "https://real-estate-portal-3ytj.onrender.com";

// LOAD DATA FROM BACKEND
async function loadProperties() {
    try {
        const response = await fetch(`${API_URL}/api/properties`);
        properties = await response.json();
        console.log(properties);
        showHome();
    } catch (error) {
        console.error("Failed to load properties:", error);
    }
}

// HOME PAGE
function showHome(list = properties) {
    let html = "";

    list.forEach((p, index) => {
        html += `
        <div class="card">
            <img 
            src="${p.images && p.images.length > 0 ? p.images[0] : ''}" 
            class="property-image">

            <h2>${p.name}</h2>
            <p>💰 ${p.price}</p>
            <p>📍 ${p.location}</p>
            <p>
            🛏 ${p.bedrooms} Bedrooms |
            🛁 ${p.bathrooms} Bathrooms
            </p>
            <p>
            📐 ${p.area}
            </p>

            <div class="actions">
            <button onclick="window.viewDetails(${index})">View Details</button>
            <button onclick="window.editProperty(${index})">Edit</button>
            <button onclick="window.deleteProperty(${index})">Delete</button>
            </div>
        </div>
        `;
    });

    app.innerHTML = html;
}

// ADD PROPERTY FORM
window.showAddForm = function() {
    app.innerHTML = `
    <h2>Add Property</h2>
    <input id="name" placeholder="Property Name">
    <input id="price" placeholder="Price">
    <input id="location" placeholder="Location">
    <input id="image1" placeholder="Image URL 1">
    <input id="image2" placeholder="Image URL 2">
    <input id="image3" placeholder="Image URL 3">
    <input id="bedrooms" placeholder="Bedrooms">
    <input id="bathrooms" placeholder="Bathrooms">
    <input id="area" placeholder="Area">
    <textarea id="description" placeholder="Description"></textarea>
    <button onclick="window.addProperty()">Add</button>
    <button onclick="window.showHome()">Back</button>
    `;
};

// ADD PROPERTY TO BACKEND
window.addProperty = async function() {
    const newProperty = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        location: document.getElementById("location").value,
        images: [
            document.getElementById("image1").value,
            document.getElementById("image2").value,
            document.getElementById("image3").value
        ],
        bedrooms: document.getElementById("bedrooms").value,
        bathrooms: document.getElementById("bathrooms").value,
        area: document.getElementById("area").value,
        description: document.getElementById("description").value
    };

    console.log("Sending new property to backend...", newProperty);

    try {
        const response = await fetch(`${API_URL}/api/properties`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProperty)
        });

        const result = await response.json();
        console.log("Server response:", result);

        if (response.ok) {
            // Instantly reload and show home
            loadProperties();
        } else {
            alert("Failed to add property. Check console for details.");
        }
    } catch (error) {
        console.error("Error adding property:", error);
    }
};

// EDIT PROPERTY
window.editProperty = function(index) {
    const p = properties[index];

    app.innerHTML = `
    <h2>Edit Property</h2>
    <input id="name" value="${p.name || ''}">
    <input id="price" value="${p.price || ''}">
    <input id="location" value="${p.location || ''}">
    <input id="image1" placeholder="Image URL 1" value="${p.images && p.images[0] ? p.images[0] : ''}">
    <input id="image2" placeholder="Image URL 2" value="${p.images && p.images[1] ? p.images[1] : ''}">
    <input id="image3" placeholder="Image URL 3" value="${p.images && p.images[2] ? p.images[2] : ''}">
    <input id="bedrooms" value="${p.bedrooms || ''}">
    <input id="bathrooms" value="${p.bathrooms || ''}">
    <input id="area" value="${p.area || ''}">
    <textarea id="description">${p.description || ''}</textarea>
    <button onclick="window.updateProperty(${index})">Update</button>
    <button onclick="window.showHome()">Cancel</button>
    `;
};

window.updateProperty = async function(index) {
    const updatedProperty = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        location: document.getElementById("location").value,
        images: [
            document.getElementById("image1").value,
            document.getElementById("image2").value,
            document.getElementById("image3").value
        ].filter(img => img.trim() !== ""), // Removes empty image slots
        bedrooms: document.getElementById("bedrooms").value,
        bathrooms: document.getElementById("bathrooms").value,
        area: document.getElementById("area").value,
        description: document.getElementById("description").value
    };

    const propertyId = properties[index]._id || properties[index].id;

    await fetch(`${API_URL}/api/properties/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProperty)
    });

    loadProperties();
};

// DELETE PROPERTY
window.deleteProperty = async function(index) {
    const propertyId = properties[index]._id || properties[index].id;

    await fetch(`${API_URL}/api/properties/${propertyId}`, {
        method: "DELETE"
    });

    await loadProperties();
};

// DETAILS PAGE
window.viewDetails = function(index) {
    const property = properties[index];

    app.innerHTML = `
    <button onclick="window.showHome()">← Back</button>
    <h2>${property.name}</h2>
    <img id="mainImage" class="details-image" src="${property.images ? property.images[0] : ''}">
    <div class="gallery">
    ${property.images ? property.images.map(image => `
        <img class="thumbnail" src="${image}" onclick="window.changeImage('${image}')">
    `).join("") : ""}
    </div>
    <p><strong>Price:</strong> ${property.price}</p>
    <p><strong>Location:</strong> ${property.location}</p>
    <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
    <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
    <p><strong>Area:</strong> ${property.area}</p>
    <p><strong>Description:</strong> ${property.description}</p>
    <button onclick="window.contactAgent()">📞 Contact Agent</button>
    <button onclick="window.addFavourite()">❤️ Add Favourite</button>
    `;
};

window.changeImage = function(image) {
    document.getElementById("mainImage").src = image;
};

window.contactAgent = function() {
    alert("Agent contact feature will be added in Phase 3.");
};

window.addFavourite = function() {
    alert("Property added to favorites.");
};

window.showHome = showHome;

// START APPLICATION
document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
});