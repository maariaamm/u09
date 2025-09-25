import Search from "./pages/Search";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import { Favorites } from "./pages/Favorites";
import "./App.css";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites/Lists</Link>
      {user && (
        <Link to="/login">My profile</Link>
      )}
      {user ? (
        <button onClick={async () => { await logout(); navigate("/"); }}>
          Sign out
        </button>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Favorites" element={<Favorites />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;