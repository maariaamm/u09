import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Search() {
  const [q, setQ] = useState('');
  const [meals, setMeals] = useState([]);
  const { user } = useAuth();

  const doSearch = async () => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
    const data = await res.json();
    setMeals(data.meals || []);
  };

  const save = async (meal) => {
    if (!user) return alert('Logga in först');
    await fetch(`${BACKEND}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token
      },
      body: JSON.stringify({
        mealId: meal.idMeal,
        title: meal.strMeal,
        thumbnail: meal.strMealThumb
      })
    });
    alert('Sparat!');
  };

  return (
    <div>
      <h2>Sök recept</h2>
      <input value={q} onChange={e => setQ(e.target.value)} />
      <button onClick={doSearch}>Sök</button>
      <div>
        {meals.map(m => (
          <div key={m.idMeal}>
            <img src={m.strMealThumb} alt="" width="80" />
            <strong>{m.strMeal}</strong>
            <button onClick={() => save(m)}>Spara</button>
          </div>
        ))}
      </div>
    </div>
  );
}