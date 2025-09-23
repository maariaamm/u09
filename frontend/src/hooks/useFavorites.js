import { useEffect, useState, useCallback } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

/**
 * useFavorites hook
 * - user: objekt från useAuth
 * Returnerar:
 * - favs: lista med favoriter
 * - loading: boolean
 * - error: feltext eller null
 * - reload: funktion för att re-fetch
 * - saveFavorite(meal): skapar favorit (POST)
 * - removeFavorite(id): tar bort favorit (DELETE)
 * - updateFavorite(id, updates): uppdaterar favorit (PUT)
 */
export default function useFavorites(user) {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavs = useCallback(async () => {
    if (!user) {
      setFavs([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/favorites`, {
        headers: { Authorization: "Bearer " + user.token },
      });
      if (!res.ok) throw new Error("Could not fetch favorites");
      const data = await res.json();
      setFavs(data || []);
      setError(null);
    } catch (err) {
      console.error("useFavorites fetch error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavs();
  }, [fetchFavs]);

  const saveFavorite = async (meal) => {
    if (!user) throw new Error("Not authenticated");
    // Optimistic UI: disable duplicate saves by checking mealId
    if (favs.some((f) => f.mealId === meal.idMeal)) {
      // already saved
      return favs.find((f) => f.mealId === meal.idMeal);
    }
    const payload = {
      mealId: meal.idMeal,
      title: meal.strMeal,
      thumbnail: meal.strMealThumb,
    };
    const res = await fetch(`${BACKEND}/api/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || "Failed to save favorite");
    }
    const created = await res.json();
    setFavs((prev) => [...prev, created]);
    return created;
  };

  const removeFavorite = async (id) => {
    if (!user) throw new Error("Not authenticated");
    // Optimistic update
    setFavs((prev) => prev.filter((f) => f._id !== id));
    const res = await fetch(`${BACKEND}/api/favorites/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + user.token },
    });
    if (!res.ok) {
      // rollback: refetch
      await fetchFavs();
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || "Failed to delete favorite");
    }
    return true;
  };

  const updateFavorite = async (id, updates) => {
    if (!user) throw new Error("Not authenticated");
    const res = await fetch(`${BACKEND}/api/favorites/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || "Failed to update favorite");
    }
    const updated = await res.json();
    setFavs((prev) => prev.map((f) => (f._id === id ? updated : f)));
    return updated;
  };

  return {
    favs,
    loading,
    error,
    reload: fetchFavs,
    saveFavorite,
    removeFavorite,
    updateFavorite,
  };
}
