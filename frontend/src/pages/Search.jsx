import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function Search() {
  const [q, setQ] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { user } = useAuth();

  // Search after a recipe
  const doSearch = async (searchTerm = q) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      console.error("Fel vid hämtning från TheMealDB", err);
      setMeals([]);
    }
  };

  useEffect(() => {
    doSearch("");
  }, []);

  // Add to favorites
  const save = async (meal) => {
    if (!user) return alert("Log in first");
    try {
      const res = await fetch(`${BACKEND}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          mealId: meal.idMeal,
          title: meal.strMeal,
          thumbnail: meal.strMealThumb,
        }),
      });

      if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.msg || "something went wrong");
      }

      const saved = await res.json();
      alert("Saved!");

      setMeals((prev) =>
        prev.map((m) =>
          m.idMeal === meal.idMeal ? { ...m, saved: true } : m
        )
      );
    } catch (err) {
      console.error(err);
      alert("could not save" + err.message);
    }
  };

  return (
    <div>
      <h2>Search for a recipe</h2> 
      <h3>or maybe just the head ingridient?</h3>
      <input value={q} onChange={(e) => setQ(e.target.value)}
      style={{ marginLeft: "550px" , padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "300px" }} />
      <button onClick={() => doSearch(q)}
        style={{ padding: "5px 30px", marginTop: "10px", borderRadius: "4px", marginLeft:"670px"}}>Search</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 4fr))", gap: "1rem", marginTop: "1rem" }}>
        {meals.map((m) => (
          <div key={m.idMeal}>
            <img  
              src={m.strMealThumb}
              alt={m.strMeal}
            
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedMeal(m)}
            />
            <strong>{m.strMeal}</strong>
            <button
              onClick={() => save(m)}
              disabled={m.saved}
            >
              {m.saved ? "Saved" : "Add to favorites"}
            </button>
          </div>
        ))}
      </div>

      {/* popup/modal */}
      {selectedMeal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedMeal(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "300px",
              maxWidth: "90vw",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
              onClick={() => setSelectedMeal(null)}
            >
              &times;
            </button>
            <h2>{selectedMeal.strMeal}</h2>
            <img src={selectedMeal.strMealThumb} alt="" width="200" />
            <p>
              <strong>Instructions:</strong>
            </p>
            <p style={{ maxHeight: 200, overflowY: "auto" }}>
              {selectedMeal.strInstructions}
            </p>
            <button onClick={() => save(selectedMeal)}>
              Add to favorites
            </button>
          </div>
        </div>
      )}
    </div>
  );
}