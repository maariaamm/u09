import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/Modal";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export default function Favorites() {
  const [lists, setLists] = useState([]);
  const { user } = useAuth();
  const [activeList, setActiveList] = useState(null); 
  const [showModal, setShowModal] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editable, setEditable] = useState(null); 

  const fetchRecipe = useCallback(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${showModal?.mealId}`)
      .then((r) => r.json())
      .then((data) => {
        console.log("fetched instructions", data);
        if (data.meals && data.meals.length > 0) {
          setSelectedMeal({ ...showModal, instructions: data.meals[0].strInstructions });
        }
      });
  }, [showModal]);

  useEffect(() => {
    if (!user) return;
    if (!activeList) {
      fetch(`${BACKEND}/api/lists`, {
        headers: { Authorization: "Bearer " + user.token },
      })
        .then((r) => r.json())
        .then(setLists);
    }
    if (!showModal) {
      setSelectedMeal(null);
      return;
    } else {
      fetchRecipe();
    }

  }, [user, showModal]);

  const deleteRecipe = async (recipe) => {
    if (!user) return alert("You must be logged in");
    if (!activeList) return alert("No active list");
    const res = await fetch(`${BACKEND}/api/lists/${activeList._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({ mealId: recipe.mealId }),
    });
    if (!res.ok) return alert("Could not remove recipe from list");
    const updatedList = await res.json();
    setActiveList(updatedList);
    setLists((prev) =>
      prev.map((l) => (l._id === updatedList._id ? updatedList : l))
    );
  };

  const handleOnBlur = async (e, l) => {
    const newTitle = e.target.value;
    if (newTitle !== l.title) {
      const res = await fetch(`${BACKEND}/api/lists/${l._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        const updatedList = await res.json();
        setLists((prev) => prev.map((list) => list._id === l._id ? updatedList : list));
      } else {
        alert("Could not update title");
      }
    }
    setEditable(null);
  }

  const deleteList = async (listId) => {
    if (!user) return alert("You must be logged in");
    const res = await fetch(`${BACKEND}/api/lists/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    if (!res.ok) return alert("Could not delete list");
    setLists((prev) => prev.filter((l) => l._id !== listId));
    if (activeList && activeList._id === listId) {
      setActiveList(null);
    }
  };

  if (!user) return <div>You have to be logged in</div>;

  const createList = async () => {
    const title = prompt("List title?");
    if (!title) return;
    const res = await fetch(`${BACKEND}/api/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return alert("Could not create list");
    const newList = await res.json();
    setLists((prev) => [...prev, newList]);
  };

  if (activeList) {
    return (
      <div>
        <div>
          <button
            onClick={() => setActiveList(null)}
            style={{ marginBottom: "1rem" }}
          >
            ← Back to lists
          </button>
          <h2>{activeList.title}</h2>
          {activeList.recipes.length === 0 && <p>No recipes in this list</p>}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
              gridAutoColumns: "1fr",
              gridAutoFlow: "dense",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {activeList.recipes.map((r) => (
              <div className="flex flex-col gap-2" key={r._id}>
                <div
                  key={r._id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: 12,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowModal(r)}
                  className="card"
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
                </div>
                <button onClick={() => deleteRecipe(r)}>Delete</button>
              </div>
            )
          )}
        </div>

        {/* Modal */}
        {showModal && selectedMeal && (
          <Modal open={!!selectedMeal} onClose={() => setShowModal(null)}>
            <div style={{ minWidth: 300, maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h2>{selectedMeal.title}</h2>
              <img
                src={selectedMeal.thumbnail}
                alt={selectedMeal.title}
                style={{
                  width: "100%",
                  maxWidth: 200,
                  display: "block",
                  margin: "0 auto 12px",
                  borderRadius: 6,
                }}
              />
              <p>
                <strong>Instructions:</strong>
              </p>
              <p>{selectedMeal.instructions || "No instructions available"}</p>
            </div>
          </Modal>
        )}
        </div>
      </div>
    );
  }

  // all lists
  return (
    <div>
      <h2>My recipe lists</h2>
      <button
        onClick={createList}
        style={{ marginBottom: "1rem", padding: "6px 12px" }}
      >
        + Create new list
      </button>

      {lists.length === 0 && <p>No lists yet</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gridAutoColumns: "1fr",
          gap: "1rem", rowGap: "2rem",
          marginTop: "1rem",
        }}
      >
        {lists.map((l) => {
          const thumbnail =
            l.recipes && l.recipes.length > 0 ? l.recipes[0].thumbnail : null;
          return (
            <div
              key={l._id}
              style={{ height: "100%", padding: "1rem", flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
              className="card"
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                { editable === l._id && <input type="text" defaultValue={l.title} autoFocus={true} onBlur={(e) => handleOnBlur(e,l)} />}
                { editable === l._id  && <button onClick={() => setEditable(null)}>Done</button>}
              </div>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 12,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}

                {...((!editable || editable != l._id) && { onClick: () => setActiveList(l) })}
              >
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={l.title}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 6,
                      marginBottom: 8,
                    }}
                  />
                )}
                { (!editable || editable != l._id)  && <h3>{l.title}</h3>}
              </div>
              <div className="buttons" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                { (!editable || editable != l._id)  && <button onClick={() => deleteList(l._id)}>Delete</button>}
                { (!editable || editable != l._id)  && <button onClick={() => setEditable(l._id)}>Edit</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Favorites };