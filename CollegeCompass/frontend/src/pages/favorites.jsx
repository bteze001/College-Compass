import { auth, db } from '../firebase'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const addFavorite = async (place) => {

    const user = auth.currentUser;
    if (!user) {
        throw new Error('Not logged in');
    }

    const ref = doc(db, 'favorites', user.uid, 'places', place.fsq_id);

    const category =
        place.categories[0].name;

    const photo =
        place.photos && place.photos.length > 0
            ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
            : '';

    const address = place.location?.address || 'Address not available';

    await setDoc(ref, {
        name: place.name,
        rating: place.rating || 0,
        category,
        address,
        photo,
        fsq_id: place.fsq_id,
    });


    // await setDoc (ref, {
    //     name: place.name,
    //     rating: place.rating,
    //     category: place.categories[0].name|| 'Unknown',
    //     address: place.location?.address || '',
    //     photo: place.photos?.[0] ? `${place.photos[0].prefix}original${place.photos[0].suffix}`: '',
    //     fsq_id: place.fsq_id,

    // });
};