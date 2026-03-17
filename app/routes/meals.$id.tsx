import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getMealById, type Meal } from "~/api/meals";

export default function MealPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    getMealById(id!).then((data) => {
      setMeal(data);
      setLoading(false);
      if (data) {
        const stored: Meal[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorited(stored.some((m) => m.idMeal === data.idMeal));
      }
    });
  }, [id]);

  function toggleFavorite() {
    if (!meal) return;
    const stored: Meal[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    const exists = stored.some((m) => m.idMeal === meal.idMeal);
    const updated = exists ? stored.filter((m) => m.idMeal !== meal.idMeal) : [...stored, meal];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorited(!exists);
  }

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
      <h1>
        {meal.strMeal}{" "}
        <button onClick={toggleFavorite}>{favorited ? "★" : "☆"}</button>
      </h1>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <p>{meal.strCategory} · {meal.strArea}</p>
    <div className="meal-detail">
      <button className="meal-detail__back" onClick={() => navigate("/meals/search")}>
        ← Back to Search
      </button>
      <h1 className="meal-detail__title">{meal.strMeal}</h1>
      <img className="meal-detail__image" src={meal.strMealThumb} alt={meal.strMeal} />
      <p className="meal-detail__meta">{meal.strCategory} · {meal.strArea}</p>

      <div className="meal-detail__content">
        <div className="meal-detail__column">
          <h2 className="meal-detail__heading">Ingredients</h2>
          <ul className="meal-detail__ingredients">
            {ingredients.map(({ ingredient, measure }) => (
              <li key={ingredient} className="meal-detail__ingredient">{measure} {ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="meal-detail__column">
          <h2 className="meal-detail__heading">Instructions</h2>
          <p className="meal-detail__instructions">{meal.strInstructions}</p>
        </div>
      </div>
    </div>
  );
}
