import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { getRandomMeal, type Meal } from "~/api/meals";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Meals Home" },
    { name: "description", content: "Go to meals search or favorites." },
  ];
}

export default function Home() {
  const [randomMeals, setRandomMeals] = useState<Meal[]>([]);
  const [loadingRandom, setLoadingRandom] = useState(true);

  useEffect(() => {
    async function loadRandomMeals() {
      const results = await Promise.all([
        getRandomMeal(),
        getRandomMeal(),
        getRandomMeal(),
        getRandomMeal(),
        getRandomMeal(),
      ]);

      setRandomMeals(results.filter((meal): meal is Meal => meal !== null));
      setLoadingRandom(false);
    }

    loadRandomMeals();
  }, []);

  return (
    <main className="home">
      <h1 className="home__title">Meals</h1>
      <p className="home__description">
        De Meals-site is een kleine webapp waar je maaltijden kan opzoeken,
        resultaten met foto en naam ziet, en doorklikt naar detailinformatie.
      </p>
      <nav className="home__nav">
        <a href="/favorites" className="home__link home__link--primary">Ga naar favorites</a>
        <a href="/meals/all" className="home__link home__link--secondary">Bekijk alle meals</a>
      </nav>

      <section className="home__random">
        <h2 className="home__random-title">5 random gerechten</h2>
        {loadingRandom && <p>Random gerechten laden...</p>}
        <ul className="home__random-list">
          {randomMeals.map((meal) => (
            <li key={meal.idMeal} className="home__random-item">
              <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} className="home__random-image" />
              <p className="home__random-name">{meal.strMeal}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}