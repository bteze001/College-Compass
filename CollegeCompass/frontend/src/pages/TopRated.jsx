import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import placeholder from '../assets/place-hold.jpg';
import './Homepage.css';

export default function TopRated({ allPlaces }) {
  const navigate = useNavigate();
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      const snapshot = await getDocs(collection(db, 'ratings'));
      const ratings = snapshot.docs.map(doc => doc.data());

      const grouped = ratings.reduce((acc, r) => {
        if (!acc[r.placeId]) acc[r.placeId] = [];
        acc[r.placeId].push(r.rating);
        return acc;
      }, {});

      const top = Object.entries(grouped).map(([placeId, ratings]) => {
        const sum = ratings.reduce((a, b) => a + b, 0);
        return {
          placeId,
          avgRating: sum / ratings.length,
        };
      });

      top.sort((a, b) => b.avgRating - a.avgRating);
      setTopRated(top); // ← No .slice!
    };

    fetchRatings();
  }, []);

  const displayList = topRated.length <= 5
    ? [...topRated, ...topRated]
    : topRated;

  if (!topRated.length) return null;

  return (
    <section className="top-rated-section">
      <h2 className="top-rated-title">⭐ Top Rated</h2>
      <div className="top-rated-marquee">
        <div className="top-rated-cards marquee-track">
          {displayList.map((entry, idx) => {
            const place = allPlaces.find(p => p.fsq_id === entry.placeId);
            if (!place) return null;

            const photo = place.photos?.[0]
              ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
              : placeholder;

            return (
              <div
                key={`${place.fsq_id}-${idx}`}
                className="top-rated-card"
                onClick={() => {
                  localStorage.setItem('selectedPlace', JSON.stringify(place));
                  navigate(`/place/${place.fsq_id}`);
                }}
              >
                <img src={photo} alt={place.name} className="top-rated-photo" />
                <div className="top-rated-content">
                  <p className="top-rated-name">{place.name}</p>
                  <p className="top-rated-address">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)} ${encodeURIComponent(place.location?.address || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      {place.location?.address || 'Address not available'}
                    </a>
                  </p>
                  <div className="top-rated-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="star">
                        {i < Math.round(entry.avgRating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
