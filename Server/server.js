const express = require("express");

const app = express();

const PORT = 5000;

const properties = [
    {
        id: 1,
        name: "Luxury Villa",
        price: "$500,000",
        location: "Beachside"
    },
    {
        id: 2,
        name: "Modern Apartment",
        price: "$300,000",
        location: "City Center"
    }
];

app.get("/", (req, res) => {
    res.send("Welcome to Dream Homes Backend!");
});

app.get("/properties", (req, res) => {
    res.json(properties);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});