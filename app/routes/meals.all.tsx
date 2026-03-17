import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllMeals, type Meal } from "~/api/meals";

export default function AllMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMeals().then((data) => {
      setMeals(data);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      <h1>All Meals</h1>
      {loading && <p>Alle meals laden...</p>}

      <ul>
        {meals.map((meal) => (
          <li key={meal.idMeal}>
            <Link to={`/meals/${meal.idMeal}`}>
              <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} />
              <span>{meal.strMeal}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
