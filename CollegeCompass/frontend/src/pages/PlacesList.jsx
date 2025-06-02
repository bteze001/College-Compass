import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { setDoc, deleteDoc, getDocs, collection, doc } from 'firebase/firestore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import placeholder from '../assets/place-hold.jpg';
import './PlacesList.css';

export default function PlacesList({ category, foodPlaces, housingPlaces,
    activityPlaces, currentLat, currentLon,
    distance, budget, SearchFilter,
    selectedFoodType, selectedHousingType, selectedActivityType, schoolName }) {

    const navigate = useNavigate();
    const [favoritePlaceIds, setFavoritePlaceIds] = useState(new Set());

    useEffect(() => {

        const fetchFavorites = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const snapshot = await getDocs(collection(db, 'favorites', user.uid, 'places'));
            const ids = new Set();
            snapshot.forEach(doc => {
                ids.add(doc.id);
            });
            setFavoritePlaceIds(ids);
        };

        fetchFavorites();
    }, []);

    const handleToggleFavorites = async (place) => {

        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to favorite places.");
            return;
        }

        const ref = doc(db, 'favorites', user.uid, 'places', place.fsq_id);

        if (favoritePlaceIds.has(place.fsq_id)) {
            await deleteDoc(ref);
            setFavoritePlaceIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(place.fsq_id);
                return newSet;
            });
        }

        else {
            await setDoc(ref, {
                name: place.name,
                rating: place.rating || 0,
                category: place.categories?.[0]?.name || '',
                address: place.location?.address || '',
                photo: place.photos?.[0] ? `${place.photos[0].prefix}original${place.photos[0].suffix}` : '',
                fsq_id: place.fsq_id
            });

            setFavoritePlaceIds(prev => new Set(prev).add(place.fsq_id));
        }
    };

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
                    <div className='place-header'>
                        <h3 className='place-title'> {place.name} </h3>
                        <span
                            className='heart-icon'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorites(place);
                            }}
                        >
                            {favoritePlaceIds.has(place.fsq_id) ? (

                                <FaHeart color='#EF4444' />
                            ) : (

                                <FaRegHeart color='#9CA3AF' />

                            )}
                        </span>
                    </div>
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
                <div className='place-header'>
                    <h3 className='place-title'> {place.name} </h3>
                    <span
                        className='heart-icon'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorites(place);
                        }}
                    >
                        {favoritePlaceIds.has(place.fsq_id) ? (

                            <FaHeart color='#EF4444' />
                        ) : (

                            <FaRegHeart color='#9CA3AF' />

                        )}
                    </span>
                </div>
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
                    <div className='place-header'>
                        <h3 className='place-title'> {place.name} </h3>
                        <span
                            className='heart-icon'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorites(place);
                            }}
                        >
                            {favoritePlaceIds.has(place.fsq_id) ? (

                                <FaHeart color='#EF4444' />
                            ) : (

                                <FaRegHeart color='#9CA3AF' />

                            )}
                        </span>
                    </div>
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