# College Compass: UC-Me

**College Compass** is a full-stack web application designed to help college students — especially freshmen and out-of-state students — discover, rate, and save local food, housing, and activity spots around their campus. Built with React and Firebase, the app integrates Foursquare’s API to provide personalized, location-based recommendations.

---

## Features

- **Search by UC Campus** – Begin by selecting your UC school to personalize your experience.
- **Authentication** – Sign up, log in, or continue as a guest via Firebase Auth.
- **Dynamic Homepage** – View local spots for food, housing, and activities.
- **Custom Filters** – Use sliders to adjust search radius and budget.
- **Save Favorites** – Authenticated users can save and manage favorite places.
- **Dashboard** – Access tabs for reviews, favorites, and settings.
- **Foursquare API Integration** – Displays real-time details including name, price, photos, and distance.

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

```
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
```

---

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/bteze001/College-Compass.git
cd College-Compass
```

2. **Navigate into the frontend directory**

```bash
cd frontend
```

3. **Install dependencies**

```bash
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `frontend` directory and add your Foursquare API key:

```
VITE_API_KEY=your_foursquare_api_key_here
```

5. **Run the app locally**

```bash
npm run dev
```

Then visit: `http://localhost:5173`

---

## Project Structure

```bash
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
```

---

## Testing & Validation

- Filters apply correctly based on distance and budget
- Foursquare API returns valid and relevant places
- Firebase Auth handles guest, register, and login flows
- Dashboard saves and renders user-specific data
- Frontend & backend communicate via Axios and routes

---

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
