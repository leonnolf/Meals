import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { searchMeals, type Meal } from "~/api/meals";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const q = searchParams.get("q") ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    setSearchParams({ q: query });
    setLoading(true);
    const results = await searchMeals(query);
    setMeals(results);
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="q" defaultValue={q} placeholder="Search meals..." />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching...</p>}

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
    </div>
  );
}