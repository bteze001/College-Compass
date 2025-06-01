//This page handles api calls to fetch places based on their category and users location 
// and caches all the fetched data to reduce api calls
import {useState, useRef, useEffect} from 'react'
import axios from 'axios'

export default function usePlacesFetcher({currentLat, currentLon}) {

    const cacheRef = useRef({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('placesCache');
        if(stored)
            cacheRef.current = JSON.parse(stored);
    }, []);

    const fetchPlaces = async(type, query, distance, budget) => {

        const categoryMap = {
            food: '13065,13145,13032',
            housing: '12035,12122',
            activity: '16032,10024,16019',
        };

        const category = categoryMap[type] || '';
        
        //update the cache key to include fields
        const key = `${type}-${category}-${currentLat}-${currentLon}-${query || 'all'}-${distance}-${budget}`;

        if(cacheRef.current[key]){
            return {data: cacheRef.current[key], fromCache: true};
        }
        
        setIsLoading(true);
        setError(null);

        try {

            const response = await axios.get('https://api.foursquare.com/v3/places/search', {

                headers: {
                    Accept: 'application/json',
                    Authorization: import.meta.env.VITE_API_KEY,
                },
                
                params: {
                    ll: `${currentLat},${currentLon}`,
                    query: query || '',
                    categories: category,
                    radius: distance * 1609,
                    limit: 50,
                    fields: 'fsq_id,name,location,categories,geocodes,photos,price,distance,rating',
                },
            });

            const results = response.data.results;
            cacheRef.current[key] = results;
            localStorage.setItem('placesCache', JSON.stringify(cacheRef.current));
            return {data: results, fromCache: false};
        }

        catch(err) {
            setError(err?.response?.data?.message || "Fetch Failed");
            return {data: [], fromCache: false};
        }

        finally {
            setIsLoading(false);
        }
    };

    const clearCache = () => {
        cacheRef.current = {};
        localStorage.removeItem('placesCache');
    }

    return {fetchPlaces, isLoading, error, clearCache};
}
