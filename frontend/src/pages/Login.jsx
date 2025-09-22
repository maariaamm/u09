import { useAuth } from "../contexts/AuthContext";
import "../index.css";
import { useState, useEffect } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Login() {
  const { user, login, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const res = await fetch(`${BACKEND}/api/favorites`, {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        });
        const data = await res.json();
        setFavorites(data);
      }
    };
    fetchFavorites();
  }, [user]);

  return (
    <div>
      {!user && <h1>Log in</h1>}
      {user ? (
        <div>
          <p>Hej, {user.name || user.email}!</p>
          <button onClick={logout}>Logga ut</button>
          <br />
          <button onClick={() => setShowFavs((v) => !v)}>
            My favorite recepies
          </button>
          {showFavs && (
            <div style={{ marginTop: "1rem" }}>
              {favorites.length === 0 ? (
                <p>Your favorites list is empty.</p>
              ) : (
                favorites.map((fav) => (
                  <div key={fav.mealId} style={{ marginBottom: "1rem" }}>
                    <img src={fav.thumbnail} alt={fav.title} width={80} />
                    <span style={{ marginLeft: 8 }}>{fav.title}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <button onClick={login}>Log in with Google</button>
        </div>
      )}
    </div>
  );
}

export default Login;