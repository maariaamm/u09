import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from "../components/Modal";

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Favorites() {
  const { user } = useAuth();
  const [favs, setFavs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${BACKEND}/api/favorites`, {
      headers: { Authorization: 'Bearer ' + user.token }
    })
      .then(r => r.json())
      .then(setFavs);
      console.log("showModal changed:", showModal);
      if (showModal) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${showModal.mealId}`)
          .then(r => r.json())
          .then(data => {
            console.log(data);
            if (data.meals && data.meals.length > 0) {
              setSelectedMeal(prev => ({ ...prev, ...data.meals[0] }));
            }
          });
      }
  }, [user, showModal]);

  const remove = async (id) => {
    await fetch(`${BACKEND}/api/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + user.token }
    });
    setFavs(prev => prev.filter(f => f._id !== id));
  };

  if (!user) return <div>You have to be logged in to view your favorite list</div>;
  return (
    <div>
    <h2>My favorite recepies</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "3rem" }}>
      {favs.map(f => (
        <div key={f._id} style={{ border: "1px solid #ccc", borderRadius: 6, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <img src={f.thumbnail} onClick={() => setShowModal(f)} alt="" width="40" style={{ cursor: "pointer", borderRadius: 6 }} />
          <strong>{f.title}</strong>
          <button onClick={() => remove(f._id)}>Delete</button>
        </div>
      ))}</div>
       {showModal && selectedMeal && ( 
              <Modal open={!!showModal} onClose={() => {
                setShowModal(null);
                setSelectedMeal(null);
              }}>
                <div style={{ minWidth: 300 }}>
                  <h2>{showModal.title}</h2>
                  <img src={showModal.thumbnail} alt="" width="200" style={{ display: "block", marginBottom: 12 }} />
                  <p>
                    <strong>Instructions:</strong>
                  </p>
                  <p style={{ maxHeight: 200, overflowY: "auto" }}>{selectedMeal.strInstructions}</p>
                </div>
              </Modal>
            )}
    </div>
  );
}

export { Favorites }; 
