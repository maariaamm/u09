import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/Modal";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function Search() {
  const [q, setQ] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    doSearch("");

    if (user) {
      fetch(`${BACKEND}/api/lists`, {
        headers: { Authorization: "Bearer " + user.token },
      })
        .then((r) => r.json())
        .then(setLists);
    }
  }, [user]);

  const doSearch = async (searchTerm = q) => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      console.error("error fetching TheMealDB", err);
      setMeals([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addToList = async (meal, listId) => {
    if (!user) return alert("Log in first");
    if (!listId) return;

    console.log("Adding to list", meal, listId);
    const res = await fetch(`${BACKEND}/api/lists/${listId}`, {
      method: "PATCH",
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

    if (!res.ok) return alert("Could not add to list");
    alert("Added to list!");
  };

  return (
    <div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 25, marginBottom: 12 }}>
        <h2 style={{fontSize: 60}} className="heading">Discover Delicious Recipes</h2>
        <div className="subtitle">
          <h2 style={{fontSize: 36, margin: 0}}>Search for a recipe</h2>
          <h3 style={{fontSize: 16, margin: 0}}>or maybe just the head ingredient?</h3>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "300px",
          }}
        />
        <button
          onClick={() => doSearch(q)}
          style={{ padding: "8px 16px", borderRadius: 4 }}
        >
          Search
        </button>
      </div>

      {searchLoading && <div>Searching...</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {meals.map((m) => (
          <div
            key={m.idMeal}
            style={{
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="card"
          >
            <img
              src={m.strMealThumb}
              alt={m.strMeal}
              style={{
                cursor: "pointer",
                width: "100%",
                height: 140,
                objectFit: "cover",
                borderRadius: 6,
              }}
              onClick={() => setSelectedMeal(m)}
            />
            <div style={{ marginTop: 8 }}>
              <h3 style={{color: "orange"}}>{m.strMeal}</h3>
            </div>
            {lists.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <select
                  onChange={(e) => addToList(m, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Add to list...</option>
                  {lists.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* popup/modal */}
      {selectedMeal && (
        <Modal open={!!selectedMeal} onClose={() => setSelectedMeal(null)}>
          <div style={{ minWidth: 300, maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>{selectedMeal.strMeal}</h2>
            <img
              src={selectedMeal.strMealThumb}
              alt=""
              width="200"
              style={{ display: "block", marginBottom: 12 }}
            />
            <p>
              <strong>Instructions:</strong>
            </p>
            <p style={{ maxHeight: 200, overflowY: "auto" }}>
              {selectedMeal.strInstructions}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}