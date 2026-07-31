const app = document.getElementById("app");


let properties = JSON.parse(localStorage.getItem("properties")) || [
 {
  name: "Luxury Villa",
  price: "$500,000",
  location: "Beachside",

  images: [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
],

  bedrooms: 4,
  bathrooms: 3,
  area: "2500 sq ft",
  description: "Luxury villa..."
}

];


function saveData() {
  localStorage.setItem("properties", JSON.stringify(properties));
}


function showHome(list = properties) {
  let html = "";

  list.forEach((p, index) => {
    html += `
      <div class="card">
        <img src="${p.images[0]}">
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>💰 ${p.price}</p>
          <p>📍 ${p.location}</p>

          <div class="actions">
    <button onclick="viewDetails(${index})">View Details</button>
    <button onclick="editProperty(${index})">Edit</button>
    <button onclick="deleteProperty(${index})">Delete</button>
</div>
        </div>
      </div>
    `;
  });

  app.innerHTML = html;
}


function showAddForm() {
  app.innerHTML = `
    <div class="form">
      <h2>Add Property</h2>
      
      <div class="row">
    <input id="name" placeholder="Property Name">
    <input id="price" placeholder="Price">
</div>

<div class="row">
    <input id="location" placeholder="Location">
    <input id="bedrooms" placeholder="Bedrooms">
</div>

<div class="row">
    <input id="bathrooms" placeholder="Bathrooms">
    <input id="area" placeholder="Area (sq ft)">
</div>

<div class="row">
    <input id="image1" placeholder="Image 1 URL">
</div>

<div class="row">
    <input id="image2" placeholder="Image 2 URL">
</div>

<div class="row">
    <input id="image3" placeholder="Image 3 URL">
</div>

<textarea id="description" placeholder="Description"></textarea>

<button onclick="addProperty()">Add</button>

<button onclick="showHome()">Back</button>
    </div>
  `;
}

function addProperty() {
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

  properties.push(newProperty);
  saveData();
  showHome();
}


function editProperty(index) {
  const p = properties[index];

  app.innerHTML = `
    <div class="form">
      <h2>Edit Property</h2>
      <div class="row">
    <input id="name" value="${p.name}" placeholder="Property Name">
    <input id="price" value="${p.price}" placeholder="Price">
</div>

<div class="row">
    <input id="location" value="${p.location}" placeholder="Location">
    <input id="bedrooms" value="${p.bedrooms}" placeholder="Bedrooms">
</div>

<div class="row">
    <input id="bathrooms" value="${p.bathrooms}" placeholder="Bathrooms">
    <input id="area" value="${p.area}" placeholder="Area">
</div>

<div class="row">
    <input id="image1" value="${p.images[0]}" placeholder="Image 1 URL">
</div>

<div class="row">
    <input id="image2" value="${p.images[1]}" placeholder="Image 2 URL">
</div>

<div class="row">
    <input id="image3" value="${p.images[2]}" placeholder="Image 3 URL">
</div>

<textarea id="description" placeholder="Description">${p.description}</textarea>
      <button onclick="updateProperty(${index})">Update</button>
      <button onclick="showHome()">Cancel</button>
    </div>
  `;
}


function updateProperty(index) {

  properties[index] = {

    name: document.getElementById("name").value,

    price: document.getElementById("price").value,

    location: document.getElementById("location").value,

    bedrooms: document.getElementById("bedrooms").value,

    bathrooms: document.getElementById("bathrooms").value,

    area: document.getElementById("area").value,

    description: document.getElementById("description").value,

    images: [
      document.getElementById("image1").value,
      document.getElementById("image2").value,
      document.getElementById("image3").value
    ]

  };

  saveData();

  showHome();
}
function filterProperties() {

  const keyword = document
    .getElementById("search")
    .value
    .toLowerCase();

  const selectedLocation =
    document.getElementById("locationFilter").value;

  const maxPrice =
    document.getElementById("priceFilter").value;

  const filtered = properties.filter(property => {

    const matchesSearch =
      property.name.toLowerCase().includes(keyword) ||
      property.location.toLowerCase().includes(keyword);

    const matchesLocation =
      selectedLocation === "" ||
      property.location === selectedLocation;

    const numericPrice =
      parseInt(property.price.replace(/[^0-9]/g, ""));

    const matchesPrice =
      maxPrice === "" ||
      numericPrice <= parseInt(maxPrice);

    return matchesSearch &&
           matchesLocation &&
           matchesPrice;

  });

  showHome(filtered);

}


function deleteProperty(index) {
  properties.splice(index, 1);
  saveData();
  showHome();
}



function viewDetails(index) {

  const property = properties[index];
  const mainImage = property.images[0];

  app.innerHTML = `
    <div class="form">
      <button onclick="showHome()">← Back</button>

      <h2>${property.name}</h2>

      <img
    id="mainImage"
    class="details-image"
    src="${mainImage}">
      <div class="gallery">
  ${property.images.map(image => `
      <img
        class="thumbnail"
        src="${image}"
        onclick="changeImage('${image}')"
      >
  `).join("")}
</div>

      <p><strong>Price:</strong> ${property.price}</p>

      <p><strong>Location:</strong> ${property.location}</p>

      <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>

      <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>


      <p><strong>Area:</strong> ${property.area}</p>

      <p><strong>Description:</strong></p>

      <p>${property.description}</p>

      <button onclick="contactAgent()">📞 Contact Agent</button>

      <button onclick="addFavourite(${index})">

❤️ Add to Favorites

</button>

    </div>
  `;

}


function contactAgent() {

    alert("Agent contact feature will be added in Phase 3.");

}


function addFavourite(index) {

    alert("Property added to favorites.");

}


function changeImage(image) {

    document.getElementById("mainImage").src = image;

}
showHome();