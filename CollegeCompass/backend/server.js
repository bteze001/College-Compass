require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
// }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const apiKey = process.env.API_KEY;
const BASE_URL = "https://api.foursquare.com/v3/places/search";

app.post("/api/filter", async (req, res) => {

    const {distance, budget, userLat, userLon} = req.body;

    try {

        const response = await axios.get(BASE_URL, {

            headers: {
                //Accept: "application/json",
                Authorization: apiKey
            },

            params: {
                ll: `${userLat}, ${userLon}`,
                radius: distance * 1609,
                //categories: "",
                limit: 50
            }
        });

        const places = response.data.results;

        const filteredPlaces = places.filter(place => {

            const price = place.price?.tier || 1;
            return price <= budget;

        });

        res.json(filteredPlaces);
    }

    catch(error) {

        console.error ('API Error:', error .message);
        res.status(500).json({error: "Failed to fetch places from Foursquare API."});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});