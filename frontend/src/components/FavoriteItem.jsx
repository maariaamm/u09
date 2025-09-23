// src/components/FavoriteItem.jsx
import React from "react";

/**
 * FavoriteItem
 * Props:
 * - fav: objekt
 * - onDelete(id)
 */

export default function FavoriteItem({ fav, onDelete }) {
  return (
    <div className="favorite-item" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <img src={fav.thumbnail} alt={fav.title} width={30} style={{ objectFit: "cover", borderRadius: 4 }} />
      <div style={{ flex: 1 }}>
        <div>
          <strong>{fav.title}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>{fav.mealId}</div>
        </div>
      </div>
      <button onClick={() => onDelete(fav._id)}>Delete</button>
    </div>
  );
}