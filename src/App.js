import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

const App = () => {
  const [query, setQuery] = useState(""); // For the search input
  const [results, setResults] = useState([]); // To store API results
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  // Fetch data from the API
  const fetchMeals = async (searchTerm) => {
    if (!searchTerm) {
      setResults([]); // Clear results if search term is empty
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      setResults(response.data.meals || []); // Update results or set empty array if no results
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced version of fetchMeals
  const debouncedFetchMeals = debounce(fetchMeals, 500);

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchMeals(value); // Trigger API call after debounce
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Meal Finder</h1>
      <input
        type="text"
        placeholder="Search for meals..."
        value={query}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />
      {isLoading && <p>Loading...</p>}
      {!isLoading && results.length === 0 && query && <p>No results found.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {results.map((meal) => (
          <div
            key={meal.idMeal}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                marginRight: "20px",
                borderRadius: "5px",
              }}
            />
            <div>
              <h3 style={{ margin: "0 0 5px 0" }}>{meal.strMeal}</h3>
              <p style={{ margin: 0, color: "#555" }}>{meal.strCategory}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
