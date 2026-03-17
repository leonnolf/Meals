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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f0e0c;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 300px 1fr;
          grid-template-rows: auto 1fr;
        }

        .hero {
          grid-column: 1 / -1;
          padding: 3rem 2.5rem 2rem;
          border-bottom: 1px solid #2a2825;
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1;
          color: #f0ece4;
          flex-shrink: 0;
        }

        .hero h1 span {
          color: #e8a838;
        }

        .search-bar {
          flex: 1;
          min-width: 240px;
          display: flex;
          gap: 0;
          border: 1px solid #3a3630;
          border-radius: 4px;
          overflow: hidden;
          background: #1a1915;
        }

        .search-bar input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.75rem 1rem;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
        }

        .search-bar input::placeholder { color: #5a5650; }

        .search-bar button {
          background: #e8a838;
          border: none;
          padding: 0.75rem 1.25rem;
          color: #0f0e0c;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .search-bar button:hover { background: #f0b840; }

        .sidebar {
          grid-row: 2;
          border-right: 1px solid #2a2825;
          overflow-y: auto;
          max-height: calc(100vh - 120px);
          position: sticky;
          top: 0;
        }

        .filter-section {
          border-bottom: 1px solid #2a2825;
          padding: 1.25rem;
        }

        .filter-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #e8a838;
          margin-bottom: 0.75rem;
        }

        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          max-height: 220px;
          overflow-y: auto;
        }

        .filter-list::-webkit-scrollbar { width: 3px; }
        .filter-list::-webkit-scrollbar-track { background: transparent; }
        .filter-list::-webkit-scrollbar-thumb { background: #3a3630; border-radius: 2px; }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.4rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.85rem;
          color: #a09880;
          transition: color 0.15s, background 0.15s;
        }

        .filter-label:hover { color: #f0ece4; background: #1a1915; }

        .filter-label input[type="checkbox"],
        .filter-label input[type="radio"] {
          accent-color: #e8a838;
          width: 13px;
          height: 13px;
          flex-shrink: 0;
        }

        .filter-label:has(input:checked) {
          color: #e8a838;
        }

        .active-filters {
          padding: 0.75rem 1.25rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tag {
          background: #e8a83820;
          border: 1px solid #e8a83850;
          color: #e8a838;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.15s;
        }

        .tag:hover { background: #e8a83840; }

        .results {
          grid-row: 2;
          padding: 1.5rem 2rem;
          overflow-y: auto;
        }

        .results-header {
          font-size: 0.8rem;
          color: #5a5650;
          margin-bottom: 1.25rem;
          letter-spacing: 0.05em;
        }

        .meal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .meal-card {
          text-decoration: none;
          color: inherit;
          display: block;
          border-radius: 6px;
          overflow: hidden;
          background: #1a1915;
          border: 1px solid #2a2825;
          transition: transform 0.2s, border-color 0.2s;
        }

        .meal-card:hover {
          transform: translateY(-3px);
          border-color: #e8a83860;
        }

        .meal-card img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
        }

        .meal-card span {
          display: block;
          padding: 0.6rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #d0ccc4;
          line-height: 1.3;
        }

        .empty {
          color: #3a3630;
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-top: 3rem;
          text-align: center;
        }

        .loading-dots {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-top: 3rem;
        }

        .loading-dots span {
          width: 8px; height: 8px;
          background: #e8a838;
          border-radius: 50%;
          animation: bounce 0.8s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>

      <div className="page">
        <header className="hero">
          <h1>Meal<span>DB</span></h1>
          <form className="search-bar" onSubmit={handleSubmit}>
            <input name="q" defaultValue={q} placeholder="Search by name…" />
            <button type="submit">Search</button>
          </form>
        </header>

        <aside className="sidebar">
          {(checkedIngredients.length > 0 || selectedCountry) && (
            <div className="active-filters">
              {checkedIngredients.map((i) => (
                <span key={i} className="tag" onClick={() => toggleIngredient(i)}>
                  {i} ×
                </span>
              ))}
              {selectedCountry && (
                <span className="tag" onClick={() => setSelectedCountry("")}>
                  {selectedCountry} ×
                </span>
              )}
            </div>
          )}

          <div className="filter-section">
            <h3>Ingredients</h3>
            <div className="filter-list">
              {ingredients.map((ingredient) => (
                <label key={ingredient} className="filter-label">
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

          <div className="filter-section">
            <h3>Country</h3>
            <div className="filter-list">
              {countries.map((country) => (
                <label key={country} className="filter-label">
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
        </aside>

        <main className="results">
          {loading ? (
            <div className="loading-dots">
              <span /><span /><span />
            </div>
          ) : meals.length === 0 ? (
            <p className="empty">Search or filter to find meals</p>
          ) : (
            <>
              <p className="results-header">{meals.length} results</p>
              <div className="meal-grid">
                {meals.map((meal) => (
                  <Link key={meal.idMeal} to={`/meals/${meal.idMeal}`} className="meal-card">
                    <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} />
                    <span>{meal.strMeal}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}