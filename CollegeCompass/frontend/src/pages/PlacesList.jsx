import coffeeShops from '../assets/coffeeShop.webp';
import park from '../assets/park.webp';

export default function PlacesList({ category, foodPlaces, housingPlaces,
                                    activityPlaces, currentLat, currentLon,
                                    distance, budget, SearchFilter,
                                    selectedFoodType, selectedHousingType, selectedActivityType }) {

    const minPrice = 1;
    /* $1-25: 1 (cheap)
       $26-50: 2(moderate)
       $51-75: 3(expensive)
       $76-100: 4(very expensive)
    */
    const maxPrice = Math.min(4, Math.ceil(budget / 25));

    if (category === 'food') {
        let filtered = SearchFilter.applyDistanceFilter(foodPlaces, currentLat, currentLon, distance);
        filtered = SearchFilter.applyBudgetFilter(filtered, minPrice, maxPrice);

        if(selectedFoodType && selectedFoodType !== 'all') {
            filtered = filtered.filter((place) => {
                const placeCategory = place.categories?.[0]?.name?.toLowerCase() || '';

                if(selectedFoodType === 'coffee') {
                    return (
                        placeCategory.includes('coffee') ||
                        placeCategory.includes('café')
                    );
                }

                if(selectedFoodType === 'fastfood') {
                    return (
                        placeCategory.includes('burger') ||
                        placeCategory.includes('fried chicken') ||
                        placeCategory.includes('fast food')
                    );
                }

                if(selectedFoodType === 'restaurants') {
                    const words = placeCategory.split(' ');
                    const lastWord = words[words.length - 1];
                    return (
                        placeCategory.includes('deli') ||
                        placeCategory.includes('pub') ||
                        lastWord === 'restaurant'
                    );
                }

                return true;
            });
        }

        return filtered.map((place) => {
            const placeCategory = place.categories?.[0]?.name?.toLowerCase() || "";
            const isCoffeeShop = placeCategory.includes('coffee') || placeCategory.includes('café');

           // console.log(`${place.name} - ${place.distance} meters`);

            return (
                <div key={place.fsq_id} className="places-box">
                    {/* {isCoffeeShop && (<img src={coffeeShops} alt="place" className="place-image" />)} */}
                    <h3>{place.name}</h3>
                    <p>{place.location.address || "Address not available"}</p>
                    {place.categories && place.categories[0] && (
                        <p className="category-tag">{place.categories[0].name}</p>
                    )}
                     {<p className='distance-text'> Price: {place.price != null ? place.price : "Price not available"}</p>}
                    {place.distance != null && (<p className='distance-text'> Distances: {place.distance / 1609} miles</p>)}
                </div>
            );
        });
    }

    if (category === 'housing') {


        let filtered = SearchFilter.applyDistanceFilter(housingPlaces, currentLat, currentLon, distance);
        filtered = SearchFilter.applyBudgetFilter(filtered, minPrice, maxPrice);

        if(selectedHousingType && selectedHousingType !== 'all') {
            filtered = filtered.filter((place) => {
                const placeCategory = place.categories?.[0]?.name?.toLowerCase() || '';

                if(selectedHousingType === 'dorms') {
                    return (
                        placeCategory.includes('college') ||
                        placeCategory.includes('hall')
                    );
                }

                if(selectedHousingType === 'apartments') {
                    return (
                        placeCategory.includes('apartment') ||
                        placeCategory.includes('condo')
                    );
                }

                return true;

            });
        }

        return filtered.map((place) => (
            <div key={place.fsq_id} className="places-box housing-box">
                <h3>{place.name}</h3>
                <p>{place.location.address || "Address not available"}</p>
                {place.categories && place.categories[0] && (
                    <p className="category-tag">{place.categories[0].name}</p>
                )}
                 {<p className='distance-text'> Price: {place.price != null ? place.price : "Price not available"}</p>}
                {place.distance != null && (<p className='distance-text'> Distances: {place.distance / 1609} miles</p>)}
            </div>
        ));
    }

    if (category === 'activity') {
        
        let filtered = SearchFilter.applyDistanceFilter(activityPlaces, currentLat, currentLon, distance);
        filtered = SearchFilter.applyBudgetFilter(filtered, minPrice, maxPrice);

        if(selectedActivityType && selectedActivityType !== 'all') {
            filtered = filtered.filter((place) => {
                const placeCategory = place.categories?.[0]?.name?.toLowerCase() || '';
                
                if (selectedActivityType === 'parks') {
                    const words = placeCategory.split(' ');
                    const lastWord = words[words.length - 1];

                    return (
                        placeCategory.includes("park") ||
                        lastWord === 'park'
                        
                    );
                }

                if(selectedActivityType === 'theater') {

                    return (
                        placeCategory.includes("movie") ||
                        placeCategory.includes("cinema") ||
                        placeCategory.includes("theater")
                    );
                }

                if(selectedActivityType ==='hiking') {

                    return (
                        placeCategory.includes("trail") ||
                        placeCategory.includes("hiking")
                    );
                }

                return true;
            });
        }

        return filtered.map((place) => {
            const placeCategory = place.categories?.[0]?.name?.toLowerCase() || "";
            const isPark = placeCategory.includes("park");

            return (
                <div key={place.fsq_id} className="places-box activity-box">
                    {/* {isPark && (<img src={park} alt="place" className='place-image' />)} */}
                    <h3>{place.name}</h3>
                    <p>{place.location.address || "Address not available"}</p>
                    {place.categories && place.categories[0] && (
                      <p className="category-tag">{place.categories[0].name}</p>
                    )}
                    {<p className='distance-text'> Price: {place.price != null ? place.price : "Price not available"}</p>}
                    {place.distance != null && (<p className='distance-text'> Distances: {place.distance / 1609} miles</p>)}
                </div>
            );
        });
    }

    return <p> Click a category to see nearby places.</p>;


}