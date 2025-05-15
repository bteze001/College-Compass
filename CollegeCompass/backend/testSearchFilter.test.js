const assert = require('assert');
const SearchFilter = require('./SearchFilter');

describe('SearchFilter - Distance Filter', () => {
    const places = [
      { name: "Place 1", coordinates: [34.1522, -118.2437], price: 15 }, //11.1 km 
      { name: "Place 2", coordinates: [34.1650, -118.2437], price: 25 }, //12.5 km
      { name: "Place 3", coordinates: [34.2000, -118.4500], price: 30 }  //25.1 km 
    ];

    const userLat = 34.0522;
    const userLon = -118.2437;

    // Test Case 1

    // Place 1 and Place 2
    it('should filter places within 15 km', () => {
      const filtered = SearchFilter.applyDistanceFilter(places, userLat, userLon, 15);
      console.log("Filtered Places within 15km:", filtered.map(p => p.name));
      assert.strictEqual(filtered.length, 2); 
    }); 

    // Place 1, 2 , and 3
    it('should filter places within 50 km', () => {
      const filtered = SearchFilter.applyDistanceFilter(places, userLat, userLon, 50);
      console.log("Filtered Places within 50km:", filtered.map(p => p.name));
      assert.strictEqual(filtered.length, 3); 
    }); 

    // []
    it('should return an empty array if no places within distance', () => {
      const filtered = SearchFilter.applyDistanceFilter(places, userLat, userLon, 1);
      console.log("Filtered Places within 1km:", filtered.map(p => p.name));
      assert.strictEqual(filtered.length, 0); 
    }); 

    // Test case 2 
    it('should filter places within budget range 10 - 20', () => {
      const filtered = SearchFilter.applyBudgetFilter(places, 10, 20);
      assert.strictEqual(filtered.length, 1);
    });

    it('should filter places within budget range 20 - 30', () => {
      const filtered = SearchFilter.applyBudgetFilter(places, 20, 30);
      assert.strictEqual(filtered.length, 2);
    });

    it('should return an empty array if no places match budget', () => {
      const filtered = SearchFilter.applyBudgetFilter(places, 35, 40);
      assert.strictEqual(filtered.length, 0);
    });

    // Test case 3
    it('should filter places within 15 km and price range 10-20', () => {
      const filtered = SearchFilter.applyDistanceFilter(places, userLat, userLon, 15);
      const budgetFiltered = SearchFilter.applyBudgetFilter(filtered, 10, 20);
      assert.strictEqual(budgetFiltered.length, 1);
  });

  it('should filter places within 50 km and price range 20-30', () => {
      const filtered = SearchFilter.applyDistanceFilter(places, userLat, userLon, 50);
      const budgetFiltered = SearchFilter.applyBudgetFilter(filtered, 20, 30);
      assert.strictEqual(budgetFiltered.length, 2);
  });

  it('should return an empty array if no places match both distance and budget', () => {
      const filtered = SearchFilter.applyDistanceFilter(places, userLat, userLon, 10);
      const budgetFiltered = SearchFilter.applyBudgetFilter(filtered, 5, 10);
      assert.strictEqual(budgetFiltered.length, 0);
  });
});
