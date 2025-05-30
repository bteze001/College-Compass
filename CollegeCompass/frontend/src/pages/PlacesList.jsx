import coffeeShops from '../assets/coffeeShop.webp';
import park from '../assets/park.webp';
import { useNavigate } from 'react-router-dom';
import placeholder from '../assets/place-hold.jpg';
import './PlacesList.css'
//import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js';

export default function PlacesList({ category, foodPlaces, housingPlaces,
    activityPlaces, currentLat, currentLon,
    distance, budget, SearchFilter,
    selectedFoodType, selectedHousingType, selectedActivityType, schoolName }) {

    const navigate = useNavigate();

    //Takes the place object and converts to a string and saves to localstorage
    const handlePlaceClick = (place) => {
        localStorage.setItem('selectedPlace', JSON.stringify(place));
        navigate(`/place/${place.fsq_id}`, {
            state: {
                schoolName,
                lat: currentLat,
                lng: currentLon
            }
        });
    };

    const minPrice = 1;
    /* convert budget to a price level fetched from the API 
       $1-25: 1 (cheap)
       $26-50: 2(moderate)
       $51-75: 3(expensive)
       $76-100: 4(very expensive)
    */
    const maxPrice = Math.min(4, Math.ceil(budget / 25));

    if (category === 'food') {

        //Filter by distance and budget
        let filtered = SearchFilter.applyDistanceFilter(foodPlaces, currentLat, currentLon, distance);
        filtered = SearchFilter.applyBudgetFilter(filtered, minPrice, maxPrice);

        // Filter by food type using the food categories fetched from API 
        if (selectedFoodType && selectedFoodType !== 'all') {
            filtered = filtered.filter((place) => {
                const placeCategory = place.categories?.[0]?.name?.toLowerCase() || '';

                if (selectedFoodType === 'coffee') {
                    return (
                        placeCategory.includes('coffee') ||
                        placeCategory.includes('café') ||
                        placeCategory.includes('bubble tea')
                    );
                }

                if (selectedFoodType === 'fastfood') {
                    return (
                        placeCategory.includes('burger') ||
                        placeCategory.includes('fried chicken') ||
                        placeCategory.includes('hot dog') ||
                        placeCategory.includes('fast food')
                    );
                }

                if (selectedFoodType === 'restaurants') {
                    const words = placeCategory.split(' ');
                    const lastWord = words[words.length - 1];
                    return (
                        !placeCategory.includes('fast food') &&
                        (placeCategory.includes('deli') ||
                            placeCategory.includes('pub') ||
                            placeCategory.includes('steak') ||
                            placeCategory.includes('diner') ||
                            placeCategory.includes('restaurant'))
                        // lastWord === 'restaurant'
                    );
                }

                return true;
            });
        }

        // Display the filtered food places 
        return filtered.map((place) => {
            const placeCategory = place.categories?.[0]?.name?.toLowerCase() || "";
            const isCoffeeShop = placeCategory.includes('coffee') || placeCategory.includes('café');

            // console.log(`${place.name} - ${place.distance} meters`);

            return (
                <div key={place.fsq_id}
                    className="places-box"
                    onClick={() => handlePlaceClick(place)}
                    style={{ cursor: 'pointer' }}>
                    <img
                        src={
                            place.photos?.[0]
                                ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
                                : placeholder
                        }
                        alt={place.name}
                        className="place-photo"
                    />
                    <h3>{place.name}</h3>
                    {place.geocodes?.main ? (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)} ${place.location.address || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='place-address-link'
                        >
                            <p>{place.location.address || "Address not available"}</p>
                        </a>

                    ) : (

                        <p>{place.location.address || "Address not available"}</p>

                    )}
                    {/* <p>{place.location.address || "Address not available"}</p> */}
                    {place.categories && place.categories[0] && (
                        <p className="category-tag">{place.categories[0].name}</p>
                    )}
                    {/* {<p className='distance-text'> Price: {place.price != null ? place.price : "Price not available"}</p>}
                    {place.distance != null && (<p className='distance-text'> Distances: {place.distance / 1609} miles</p>)} */}
                </div>
            );
        });
    }

    if (category === 'housing') {


        let filtered = SearchFilter.applyDistanceFilter(housingPlaces, currentLat, currentLon, distance);
        filtered = SearchFilter.applyBudgetFilter(filtered, minPrice, maxPrice);

        if (selectedHousingType && selectedHousingType !== 'all') {
            filtered = filtered.filter((place) => {
                const placeCategory = place.categories?.[0]?.name?.toLowerCase() || '';

                if (selectedHousingType === 'dorms') {
                    return (
                        (placeCategory.includes('college') ||
                            placeCategory.includes('hall')) &&
                        place.distance / 1609 <= 1
                    );
                }

                if (selectedHousingType === 'apartments') {
                    return (
                        (placeCategory.includes('apartment') ||
                            placeCategory.includes('condo') ||
                            placeCategory.includes('college')) &&
                        place.distance / 1609 > 1
                    );
                }

                return true;

            });
        }

        return filtered.map((place) => (
            <div key={place.fsq_id}
                className="places-box housing-box"
                onClick={() => handlePlaceClick(place)}
                style={{ cursor: 'pointer' }}>
                <img
                    src={
                        place.photos?.[0]
                            ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
                            : placeholder
                    }
                    alt={place.name}
                    className="place-photo"
                />
                <h3>{place.name}</h3>
                {place.geocodes?.main ? (
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)} ${place.location.address || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='place-address-link'
                    >
                        <p>{place.location.address || "Address not available"}</p>
                    </a>

                ) : (

                    <p>{place.location.address || "Address not available"}</p>

                )}
                {/* <p>{place.location.address || "Address not available"}</p> */}
                {place.categories && place.categories[0] && (
                    <p className="category-tag">{place.categories[0].name}</p>
                )}
                {/* {<p className='distance-text'> Price: {place.price != null ? place.price : "Price not available"}</p>}
                {place.distance != null && (<p className='distance-text'> Distances: {place.distance / 1609} miles</p>)} */}
            </div>
        ));
    }

    if (category === 'activity') {

        let filtered = SearchFilter.applyDistanceFilter(activityPlaces, currentLat, currentLon, distance);
        filtered = SearchFilter.applyBudgetFilter(filtered, minPrice, maxPrice);

        if (selectedActivityType && selectedActivityType !== 'all') {
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

                if (selectedActivityType === 'theater') {

                    return (
                        placeCategory.includes("movie") ||
                        placeCategory.includes("cinema") ||
                        placeCategory.includes("theater")
                    );
                }

                if (selectedActivityType === 'hiking') {

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
                <div key={place.fsq_id}
                    className="places-box activity-box"
                    onClick={() => handlePlaceClick(place)}
                    style={{ cursor: 'pointer' }}>
                    <img
                        src={
                            place.photos?.[0]
                                ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
                                : placeholder
                        }
                        alt={place.name}
                        className="place-photo"
                    />
                    <h3>{place.name}</h3>
                    {place.geocodes?.main ? (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)} ${place.location.address || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='place-address-link'
                        >
                            <p>{place.location.address || "Address not available"}</p>
                        </a>

                    ) : (

                        <p>{place.location.address || "Address not available"}</p>

                    )}

                    {place.categories && place.categories[0] && (
                        <p className="category-tag">{place.categories[0].name}</p>
                    )}
                    {/* {<p className='distance-text'> Price: {place.price != null ? place.price : "Price not available"}</p>}
                    {place.distance != null && (<p className='distance-text'> Distances: {place.distance / 1609} miles</p>)} */}
                </div>
            );
        });
    }

    return <p> Click a category to see nearby places.</p>;


}