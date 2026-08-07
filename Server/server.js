const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Load .env relative to this file's folder
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("MY UPDATED SERVER IS RUNNING");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// ============================================
// MONGODB CONNECTION & MODEL
// ============================================

console.log("Loaded URI:", process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is undefined. Please check your .env file.");
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error.message);
    });
}

// Define Property Schema & Model
const propertySchema = new mongoose.Schema({
  name: String,
  price: String,
  location: String,
  images: [String],
  bedrooms: String,
  bathrooms: String,
  area: String,
  description: String
});

const Property = mongoose.model("Property", propertySchema);

// ============================================
// API ROUTES
// ============================================

// Get all properties
app.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a property
app.post("/properties", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a property
app.put("/properties/:id", async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a property
app.delete("/properties/:id", async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});