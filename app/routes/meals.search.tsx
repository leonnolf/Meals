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
    <div className="search">
      <div className="search__header">
        <h1 className="search__title">Meal<span className="search__title-accent">DB</span></h1>
        <form className="search__form" onSubmit={handleSubmit}>
          <input name="q" defaultValue={q} placeholder="Search by name…" className="search__input" />
          <button type="submit" className="search__button">Search</button>
        </form>
      </div>

      <div className="search__filters">
        <div className="search__filter-group">
          <label className="search__filter-label">Ingredients</label>
          <div className="search__filter-list">
            {ingredients.map((ingredient) => (
              <label key={ingredient} className="search__filter-item">
                <input
                  type="checkbox"
                  value={ingredient}
                  checked={checkedIngredients.includes(ingredient)}
                  onChange={() => toggleIngredient(ingredient)}
                />
                {ingredient}
              </label>
            ))}
          </div>
        </div>

        <div className="search__filter-group">
          <label className="search__filter-label">Country</label>
          <div className="search__filter-list">
            {countries.map((country) => (
              <label key={country} className="search__filter-item">
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
          </div>
        </div>
      </div>

      {(checkedIngredients.length > 0 || selectedCountry) && (
        <div className="search__active-filters">
          {checkedIngredients.map((i) => (
            <span key={i} className="search__tag" onClick={() => toggleIngredient(i)}>
              {i} ×
            </span>
          ))}
          {selectedCountry && (
            <span className="search__tag" onClick={() => setSelectedCountry("")}>
              {selectedCountry} ×
            </span>
          )}
        </div>
      )}

      <div className="search__results">
        {loading ? (
          <div className="search__loading">
            <span></span><span></span><span></span>
          </div>
        ) : meals.length === 0 ? (
          <p className="search__empty">Search or filter to find meals</p>
        ) : (
          <>
            <p className="search__result-count">{meals.length} results</p>
            <div className="search__grid">
              {meals.map((meal) => (
                <Link key={meal.idMeal} to={`/meals/${meal.idMeal}`} className="search__card">
                  <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} className="search__card-image" />
                  <span className="search__card-name">{meal.strMeal}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}