const app = document.getElementById("app");

let properties = [];

// Base API URL
const API_URL = "https://real-estate-portal-3ytj.onrender.com";

// LOAD DATA FROM BACKEND
async function loadProperties() {
    const response = await fetch(`${API_URL}/properties`);
    properties = await response.json();
    console.log(properties);
    showHome();
}

// OLD LOCAL STORAGE FUNCTION (NOT USED)
function saveData() {
    // Backend is handling storage now
}

// HOME PAGE
function showHome(list = properties) {
    let html = "";

    list.forEach((p, index) => {
        html += `
        <div class="card">
            <img 
            src="${p.images ? p.images[0] : ''}" 
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
            <button onclick="viewDetails(${index})">
            View Details
            </button>

            <button onclick="editProperty(${index})">
            Edit
            </button>

            <button onclick="deleteProperty(${index})">
            Delete
            </button>
            </div>
        </div>
        `;
    });

    app.innerHTML = html;
}

// ADD PROPERTY FORM
function showAddForm() {
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

<button onclick="addProperty()">
Add
</button>

<button onclick="showHome()">
Back
</button>
`;
}

// ADD PROPERTY TO BACKEND
async function addProperty(){
const newProperty = {
name: document.getElementById("name").value,
price: document.getElementById("price").value,
location: document.getElementById("location").value,
images:[
document.getElementById("image1").value,
document.getElementById("image2").value,
document.getElementById("image3").value
],
bedrooms: document.getElementById("bedrooms").value,
bathrooms: document.getElementById("bathrooms").value,
area: document.getElementById("area").value,
description: document.getElementById("description").value
};

await fetch(
`${API_URL}/properties`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(newProperty)
});

loadProperties();
}

// EDIT PROPERTY
function editProperty(index){
const p = properties[index];

app.innerHTML = `
<h2>Edit Property</h2>

<input id="name" value="${p.name}">
<input id="price" value="${p.price}">
<input id="location" value="${p.location}">
<input id="bedrooms" value="${p.bedrooms}">
<input id="bathrooms" value="${p.bathrooms}">
<input id="area" value="${p.area}">
<textarea id="description">
${p.description}
</textarea>

<button onclick="updateProperty(${index})">
Update
</button>

<button onclick="showHome()">
Cancel
</button>
`;
}

async function updateProperty(index){
const updatedProperty={
name: document.getElementById("name").value,
price: document.getElementById("price").value,
location: document.getElementById("location").value,
bedrooms: document.getElementById("bedrooms").value,
bathrooms: document.getElementById("bathrooms").value,
area: document.getElementById("area").value,
description: document.getElementById("description").value,
images: properties[index].images
};

// Check for MongoDB _id first, then fallback to id
const propertyId = properties[index]._id || properties[index].id;

await fetch(
`${API_URL}/properties/${propertyId}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(updatedProperty)
}
);

loadProperties();
}

// SEARCH AND FILTER
function filterProperties(){
const keyword = document.getElementById("search").value.toLowerCase();
const maxPrice = document.getElementById("priceFilter").value;

const filtered = properties.filter(property=>{
const matchesSearch =
property.name.toLowerCase().includes(keyword) ||
property.location.toLowerCase().includes(keyword);

const price = parseInt(property.price.replace(/[^0-9]/g,""));
const matchesPrice = maxPrice === "" || price <= Number(maxPrice);

return matchesSearch && matchesPrice;
});

showHome(filtered);
}

// DELETE PROPERTY
async function deleteProperty(index){
// Check for MongoDB _id first, then fallback to id
const propertyId = properties[index]._id || properties[index].id;

await fetch(
`${API_URL}/properties/${propertyId}`,
{
method:"DELETE"
}
);

await loadProperties();
}

// DETAILS PAGE
function viewDetails(index){
const property = properties[index];

app.innerHTML = `
<button onclick="showHome()">
← Back
</button>

<h2>${property.name}</h2>

<img
id="mainImage"
class="details-image"
src="${property.images ? property.images[0] : ''}"
>

<div class="gallery">
${property.images ? property.images.map(image=>`
<img
class="thumbnail"
src="${image}"
onclick="changeImage('${image}')"
>
`).join("") : ""}
</div>

<p><strong>Price:</strong> ${property.price}</p>
<p><strong>Location:</strong> ${property.location}</p>
<p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
<p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
<p><strong>Area:</strong> ${property.area}</p>
<p><strong>Description:</strong> ${property.description}</p>

<button onclick="contactAgent()">
📞 Contact Agent
</button>

<button onclick="addFavourite()">
❤️ Add Favourite
</button>
`;
}

function changeImage(image){
document.getElementById("mainImage").src=image;
}

function contactAgent(){
alert("Agent contact feature will be added in Phase 3.");
}

function addFavourite(){
alert("Property added to favorites.");
}

// START APPLICATION
loadProperties();