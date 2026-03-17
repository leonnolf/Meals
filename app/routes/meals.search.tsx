import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  searchMeals,
  getIngredients,
  getCountries,
  getMealsByIngredients,
  getMealsByCountry,
  type Meal,
  type MealSummary,
} from "~/api/meals";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [meals, setMeals] = useState<Meal[] | MealSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const q = searchParams.get("q") ?? "";

  useEffect(() => {
    getIngredients().then(setIngredients);
    getCountries().then(setCountries);
  }, []);

  function toggleIngredient(ingredient: string) {
    setCheckedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    setLoading(true);

    if (checkedIngredients.length > 0) {
      const results = await getMealsByIngredients(checkedIngredients);
      setMeals(results);
    } else if (selectedCountry) {
      const results = await getMealsByCountry(selectedCountry);
      setMeals(results);
    } else {
      setSearchParams({ q: query });
      const results = await searchMeals(query);
      setMeals(results);
    }

    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="q" defaultValue={q} placeholder="Search meals..." />

        <h3>Ingredients</h3>
        {ingredients.map((ingredient) => (
          <label key={ingredient}>
            <input
              type="checkbox"
              value={ingredient}
              checked={checkedIngredients.includes(ingredient)}
              onChange={() => toggleIngredient(ingredient)}
            />
            {ingredient}
          </label>
        ))}

        <h3>Country</h3>
        {countries.map((country) => (
          <label key={country}>
            <input
              type="radio"
              name="countries"
              value={country}
              checked={selectedCountry === country}
              onChange={() => setSelectedCountry(country)}
            />
            {country}
          </label>
        ))}

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