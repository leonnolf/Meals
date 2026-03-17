import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getMealById, type Meal } from "~/api/meals";

export default function MealPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealById(id!).then((data) => {
      setMeal(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!meal) return <p>Meal not found.</p>;

  const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
    .map((n) => ({
      ingredient: meal[`strIngredient${n}`],
      measure: meal[`strMeasure${n}`],
    }))
    .filter(({ ingredient }) => ingredient?.trim());

  return (
    <div>
      <h1>{meal.strMeal}</h1>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <p>{meal.strCategory} · {meal.strArea}</p>

      <h2>Ingredients</h2>
      <ul>
        {ingredients.map(({ ingredient, measure }) => (
          <li key={ingredient}>{measure} {ingredient}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <p>{meal.strInstructions}</p>
    </div>
  );
}