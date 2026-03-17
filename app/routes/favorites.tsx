import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Meal } from "~/api/meals";

export default function FavoritesPage() {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const stored: Meal[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    setMeals(stored);
  }, []);

  return (
    <main className="favorites">
      <h1 className="favorites__title">Favorieten ★</h1>
      {meals.length === 0 ? (
        <p className="favorites__empty">Geen favorieten nog.</p>
      ) : (
        <ul className="favorites__list">
          {meals.map((meal) => (
            <li key={meal.idMeal} className="favorites__item">
              <Link to={`/meals/${meal.idMeal}`} className="favorites__link">
                {meal.strMeal}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
