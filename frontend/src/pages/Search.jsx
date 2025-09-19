import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function Search() {
  const [q, setQ] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null); // För popup/modal
  const { user } = useAuth();

  const doSearch = async (searchTerm = q) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        searchTerm
      )}`
    );
    const data = await res.json();
    setMeals(data.meals || []);
  };

  useEffect(() => {
    doSearch("");
  }, []);

  const save = async (meal) => {
    if (!user) return alert("Logga in först");
    await fetch(`${BACKEND}/api/favorites`, {
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
    alert("Sparat!");
  };

  return (
    <div>
      <h2>Sök recept!</h2>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <button onClick={() => doSearch(q)}>Sök</button>
      <div>
        {meals.map((m) => (
          <div key={m.idMeal}>
            <img
              src={m.strMealThumb}
              alt=""
              width="150"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedMeal(m)}
            />
            <strong>{m.strMeal}</strong>
            <button onClick={() => save(m)}>Lägg till i favoriter</button>
          </div>
        ))}
      </div>

      {/* popupmodal */}
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
              <strong>Instruktioner:</strong>
            </p>
            <p style={{ maxHeight: 200, overflowY: "auto" }}>
              {selectedMeal.strInstructions}
            </p>
             <button onClick={() => save(selectedMeal)}>Lägg till i favoriter</button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Search };
