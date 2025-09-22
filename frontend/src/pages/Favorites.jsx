import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Favorites() {
  const { user } = useAuth();
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`${BACKEND}/api/favorites`, {
      headers: { Authorization: 'Bearer ' + user.token }
    })
      .then(r => r.json())
      .then(setFavs);
  }, [user]);

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
      <h2>MY favorites</h2>
      {favs.map(f => (
        <div key={f._id}>
          <img src={f.thumbnail} alt="" width="80" />
          <strong>{f.title}</strong>
          <button onClick={() => remove(f._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export { Favorites };