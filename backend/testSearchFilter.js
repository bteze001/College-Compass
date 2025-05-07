const SearchFilter = require ('./SearchFilter');

const places = [
    {
        name: "Coffee Shop 1",
        //geocodes: {main: {latitude: 33.9745, longitude: -117.3289} },
        coordinates: [33.9745, -117.3289],
        price: 2
    },

    {
        name: "Coffee Shop 2",
        //geocodes: { main: { latitude: 34.0000, longitude: -117.3289 } },
        coordinates: [34.0000, -117.3289],
        price: 3
    },
    
    {
        name: "Coffee Shop 3",
        coordinates: [33.9600, -117.3200],
        PriceRange: 4
    }
];

const userLat = 33.9741;
const userLon = -117.3281;
const maxDistance = 5;

const filteredDistance = SearchFilter.applyDistanceFilter(places, userLat, userLon, maxDistance);
console.log("\nFiltered by Distance (<= 5 km):");
console.log(filteredDistance);

const minPrice = 2;
const maxPrice = 3;
const filteredBudget = SearchFilter.applyBudgetFilter(filteredDistance, minPrice, maxPrice);
console.log("\nFiltered by Distance and Budget (Price 2 - 3):");
console.log(filteredBudget);

