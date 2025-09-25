import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from "../components/Modal";
import { useParams } from 'react-router-dom';
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function List() {
    const { user } = useAuth();
    const [list, setLists] = useState([]);
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);

    useEffect(() => {
        if (!user) return;
        fetch(`${BACKEND}/api/lists/${id}`, {
            headers: { Authorization: 'Bearer ' + user.token }
        })
            .then(r => r.json())
            .then(setLists);
    }, [user]);

    if (!list) return <p>Loading...</p>;
    if (list.error) return <p>Error: {list.error}</p>;

    return (
      <div>
        <button
          onClick={() => showModal(null)}
          style={{ marginBottom: "1rem" }}
        >
          ← Back to lists
        </button>
        <h2>{list.title}</h2>
        {list.recipes?.length === 0 && <p>No recipes in this list</p>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {list.recipes?.map((r) => (
            <div
              key={r._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 12,
                cursor: "pointer",
              }}
              onClick={() => setSelectedMeal(r)}
            >
              <img
                src={r.thumbnail}
                alt={r.title}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              />
              <strong>{r.title}</strong>
              <button>Delete</button>
              <button>Edit</button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedMeal && (
          <Modal open={!!selectedMeal} onClose={() => setSelectedMeal(null)}>
            <h2>{selectedMeal.title}</h2>
            <img
              src={selectedMeal.thumbnail}
              alt={selectedMeal.title}
              style={{
                width: "100%",
                maxWidth: 300,
                display: "block",
                margin: "0 auto 12px",
                borderRadius: 6,
              }}
            />
            <p>
              <strong>Instructions:</strong>
            </p>
            <p>{selectedMeal.instructions || "No instructions available"}</p>
          </Modal>
        )}
      </div>
    );

}