class SearchFilter {

    static applyDistanceFilter (places, userLat, userLon, maxDistance) {
        
        // Loop through each place and keep if it pass distance check 
        return places.filter ((place) => {
            
            // Extract the coordinates 
           const lat = place.geocodes?.main?.latitude;
           const lon = place.geocodes?.main?.longitude;

           if(lat == null || lon == null) {
            return false;
           }
            //Calculate distance (distance returned by haversine is in Km so we convert it to miles)
            const disKm = SearchFilter.haversine(userLat, userLon, lat, lon);
            const distMi = disKm * 0.621371;

            return distMi <= maxDistance;
        });
    }

    static applyBudgetFilter (places, minPrice, maxPrice) {

        //filter places by checking if their place is between the minprice and the maxprice
        return places.filter ((place) => {
            const price = place.price ?? 1;
            return price >= minPrice && price <= maxPrice;
        });
    }

    static haversine (lat1, lon1, lat2, lon2) {

        //radius of earth in km (3958.8 miles)
        const R = 6371; 

        //Differences in latitude and longitude in radians 
        const dLat = SearchFilter.convertToRad(lat2 - lat1);
        const dLon = SearchFilter.convertToRad(lon2 - lon1);

        // Use haversine's formula 
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos( SearchFilter.convertToRad(lat1)) * Math.cos( SearchFilter.convertToRad(lat2)) *
                  Math.sin (dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return distance; //returns distance in kilometer 

    }

    static convertToRad (degrees) {

        return degrees * Math.PI / 180;
    }
}

export default SearchFilter;