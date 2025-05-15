// Load the .env file
require('dotenv').config();
const axios = require('axios');
const SearchFilter = require('./SearchFilter');

const apiKey = process.env.VITE_API_KEY;

const headers = {

    Accept: 'application/json',
    Authorization: apiKey

};

const params = {

    // query: 'coffee',
    ll: '33.9741,-117.3281',
    categories: "11110,11108",
    radius: 8047,
    limit: 10
};

axios.get('https://api.foursquare.com/v3/places/search', {
    headers,
    params
})

.then(res=> {
    const places = res.data.results;
    console.log('Search results:\n', places);

})

.catch(err => {
    console.error('API Error:', err.message);
});

