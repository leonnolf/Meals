import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Meal } from "~/api/meals";

export default function FavoritesPage() {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const stored: Meal[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    setMeals(stored);
  }, []);

  if (meals.length === 0) return <p>Geen favorieten nog.</p>;

  return (
    <div>
      <h1>Favorieten ★</h1>
      <ul>
        {meals.map((meal) => (
          <li key={meal.idMeal}>
            <Link to={`/meals/${meal.idMeal}`}>{meal.strMeal}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
