# College Compass: UC-Me

**College Compass** is a full-stack web application designed to help college students — especially freshmen and out-of-state students — discover, rate, and save local food, housing, and activity spots around their campus. Built with React and Firebase, the app integrates Foursquare’s API to provide personalized, location-based recommendations.

---

## Features

- **Search by UC Campus** – Begin by selecting your UC school to personalize your experience.  
- **Authentication** – Sign up, log in, or continue as a guest via Firebase Auth.  
- **Dynamic Homepage** – View places for food, housing, and activities.  
- **Search Bar** – Search places by keyword within selected category.  
- **Subcategory Filters** – Filter by options like “Coffee Shops,” “Off-Campus Housing,” or “Hiking.”  
- **Budget & Distance Filters** – Use multi-range sliders to refine results.  
- **Favorites** – Save and manage favorite places in your dashboard.  
- **Ratings & Reviews** – Submit reviews with star ratings and comments.  
- **Top Rated Section** – View trending and highest-rated locations.  
- **Dashboard** – View your saved favorites, reviews, and edit your account info.  
- **Directions** – Each place includes a Google Maps link.  
- **Add New Places** – Users can suggest new businesses to be added.

---

## Tech Stack

| Frontend  | Backend | Database | API              |
|-----------|---------|----------|------------------|
| React     | Node.js | Firebase | Foursquare Places |

**Additional Tools:**  
- **Design** – Figma, Lucidchart  
- **Routing** – React Router  
- **Auth** – Firebase Authentication  
- **Styling** – CSS, Material UI  

---

## System Architecture

Frontend (React)  
│  
├── UI Components  
│   ├── LandingPage.jsx  
│   ├── Homepage.jsx  
│   ├── Dashboard.jsx  
│   └── Login/Signup.jsx  
│  
├── Hooks  
│   ├── usePlacesFetcher.js  
│   └── useCurrentUser.js  
│  
Backend (Node.js + Axios)  
│  
└── Firebase  
    ├── Firestore Database  
    └── Firebase Auth

---

## Getting Started

1. **Clone the repository**  
git clone https://github.com/bteze001/College-Compass.git  
cd College-Compass  

2. **Navigate into the frontend directory**  
cd frontend  

3. **Install dependencies**  
npm install vitest@latest @vitest/coverage-v8@latest  
npm install  

4. **Set up environment variables**  
Create a `.env` file in the `frontend` directory and add your Foursquare API key:  
VITE_API_KEY=your_foursquare_api_key_here

5. **Run the app locally**  
npm run dev  
Then visit: http://localhost:5173

---

## Project Structure

College-Compass/  
├── backend/  
│   └── places.js  
├── frontend/  
│   ├── src/  
│   │   ├── pages/  
│   │   │   ├── Homepage.jsx  
│   │   │   ├── Login.jsx  
│   │   │   └── Dashboard.jsx  
│   │   ├── components/  
│   │   └── App.jsx  
│   └── public/  
├── firebase.js  
└── .env

---

## Testing & Validation

We wrote test cases using Vitest and React Testing Library to validate key functionality across the app:

- **Landing Page (SearchSchool)** – Tested school selection, navigation, and filtering input.  
- **Top Rated Component** – Tested rendering top-rated places, clicking, and navigation.  
- **Homepage** – Verified category filtering, search input behavior, and UI interactions.  
- **Place Detail Page** – Tested review submission, display logic, and fallback UI.  
- **Dashboard** – Checked tab switching, displaying user favorites/reviews.  
- **Account Settings** – Verified profile info edits and form updates.  
- **Favorites & Filters** – Simulated heart toggles, subcategory filters, and slider controls.

To run all tests and view coverage:  
```bash
npx vitest run --coverage
npx vitest run --coverage src/pages/TopRated.test.jsx


## Team

- **Aliyah Owens**  
- **Tanishaa Singh**  
- **Ella Kerrigan**  
- **Jaydah Julian**  
- **Christina Serrato**  
- **Beza Tezera**

---

## License

This project is for educational purposes only. © 2025 College Compass Team
