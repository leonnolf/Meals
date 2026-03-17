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
    <main className="all-meals">
      <h1 className="all-meals__title">Alle Maaltijden</h1>
      {loading && <p className="all-meals__loading">Alle meals laden...</p>}

      <ul className="all-meals__list">
        {meals.map((meal) => (
          <li key={meal.idMeal} className="all-meals__item">
            <Link to={`/meals/${meal.idMeal}`} className="all-meals__link">
              <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} className="all-meals__image" />
              <span className="all-meals__name">{meal.strMeal}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
