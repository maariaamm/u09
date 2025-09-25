import { useAuth } from "../contexts/AuthContext";
import "../index.css";
import React, { useState } from "react";
import Modal from "../components/Modal";
import Favorites from "./Favorites";

export default function Login() {
  const { user, login, logout } = useAuth();
  const [showFavs, setShowFavs] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      {!user && <h1>Log in</h1>}
      {user ? (
        <div>
          <p>Hello, {user.name || user.email}!</p>
          <button style={{marginTop: "1rem"}} onClick={logout}>Log out</button>
          <button style={{marginTop: "1rem"}} onClick={() => setShowFavs((v) => !v)}>My favorite recepies</button>

          <Modal open={showFavs} onClose={() => setShowFavs(false)}>
            {/* modal component */}
            <Favorites open={true} onClose={() => setShowFavs(false)} />
          </Modal>
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