import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useFavorites from "../hooks/useFavorites";
import Modal from "../components/Modal";

export default function Search() {
  const [q, setQ] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { user } = useAuth();
  const { favs, saveFavorite } = useFavorites(user);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search after a recipe
  const doSearch = async (searchTerm = q) => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
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

  useEffect(() => {
    doSearch("");
  }, []);

  // Add to favorites (via hook)
  const save = async (meal) => {
    if (!user) return alert("Log in first");
    try {
      await saveFavorite(meal);
      // update local meals to mark as saved
      setMeals((prev) => prev.map((m) => (m.idMeal === meal.idMeal ? { ...m, saved: true } : m)));
      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("could not save: " + err.message);
    }
  };

  // Helper: check if meal already saved
  const isSaved = (meal) => {
    return favs.some((f) => f.mealId === meal.idMeal);
  };

  return (
    <div>
      <h2>Search for a recipe</h2>
      <h3>or maybe just the head ingredient?</h3>

      <div style={{ display: "flex", justifyContent: "center", width: "100%", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "300px" }}
        />
        <button onClick={() => doSearch(q)} style={{ padding: "8px 16px", borderRadius: 4 }}>
          Search
        </button>
      </div>

      {searchLoading && <div>Searching...</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
        {meals.map((m) => (
          <div key={m.idMeal} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
            <img
              src={m.strMealThumb}
              alt={m.strMeal}
              style={{ cursor: "pointer", width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
              onClick={() => setSelectedMeal(m)}
            />
            <div style={{ marginTop: 8 }}>
              <strong>{m.strMeal}</strong>
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => save(m)} disabled={isSaved(m)} style={{ marginRight: 8 }}>
                {isSaved(m) ? "Saved" : "Add to favorites"}
              </button>
              <button onClick={() => setSelectedMeal(m)}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* popup/modal */}
      {selectedMeal && (
        <Modal open={!!selectedMeal} onClose={() => setSelectedMeal(null)}>
          <div style={{ minWidth: 300 }}>
            <h2>{selectedMeal.strMeal}</h2>
            <img src={selectedMeal.strMealThumb} alt="" width="200" style={{ display: "block", marginBottom: 12 }} />
            <p>
              <strong>Instructions:</strong>
            </p>
            <p style={{ maxHeight: 200, overflowY: "auto" }}>{selectedMeal.strInstructions}</p>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => { save(selectedMeal); setSelectedMeal(null); }} disabled={isSaved(selectedMeal)}>
                {isSaved(selectedMeal) ? "Saved" : "Add to favorites"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}