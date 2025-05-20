/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchSchool from "../components/SearchSchool"; // 🔧 Adjust path if needed
import { MemoryRouter } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "./firebase"; // 🔧 Adjust path if needed

// 🎯 Test data
const mockSchools = [
  { name: "UCLA", fullName: "University of California, Los Angeles", latitude: 34.0689, longitude: -118.4452 },
  { name: "UC Riverside", fullName: "University of California, Riverside", latitude: 33.9737, longitude: -117.3281 },
  { name: "UC Berkeley", fullName: "University of California, Berkeley", latitude: 37.8719, longitude: -122.2585 },
  { name: "UC Irvine", fullName: "University of California, Irvine", latitude: 33.6405, longitude: -117.8390 },
];


// 🧪 UI TEST CASES
describe("School Selection Tests", () => {

  // TC1
  test("Filters matching results (e.g., 'Irvine')", () => {
    render(<SearchSchool placeholder="Search..." data={mockSchools} />);
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "Irvine" } });

    expect(screen.getByText(/Irvine/i)).toBeInTheDocument();
  });

  // TC2
  test("Search is case-insensitive (e.g., 'uC rIverSide')", () => {
    render(<SearchSchool placeholder="Search..." data={mockSchools} />);
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "uC rIverSide" } });

    expect(screen.getByText(/Riverside/i)).toBeInTheDocument();
  });

  // TC3
  test("No results for blank or invalid input (e.g., 'Stanford')", () => {
    render(<SearchSchool placeholder="Search..." data={mockSchools} />);
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "Stanford" } });

    expect(screen.queryByText(/University of California/i)).not.toBeInTheDocument();
  });

  // TC4
  test("Login and Sign Up buttons appear", () => {
    render(
      <MemoryRouter>
        <SearchSchool placeholder="Search..." data={mockSchools} />
      </MemoryRouter>
    );

    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

});


// _FIREBASE TEST CASE )
export async function testFirebaseWrite() {
  const selectedSchool = "UC Riverside";
  const coordinates = [33.9737, -117.3281];

  const data = {
    school: selectedSchool,
    coordinates,
    timestamp: new Date(),
  };

  try {
    const ref = collection(firestore, "School Selection");
    const docRef = await addDoc(ref, data);
    console.log("✅ Firebase write success:", docRef.id);
  } catch (e) {
    console.error("❌ Firebase write failed:", e);
  }
}
