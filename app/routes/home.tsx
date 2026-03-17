import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { getRandomMeal, type Meal } from "~/api/meals";

export function meta({}: Route.MetaArgs) {
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
    <main>
      <h1>Meals</h1>
      <p>
        De Meals-site is een kleine webapp waar je maaltijden kan opzoeken,
        resultaten met foto en naam ziet, en doorklikt naar detailinformatie.
      </p>
      <a href="/meals/search">Ga naar meals search</a>
      <br />
      <a href="/favorites">Ga naar favorites</a>
      <br />
      <a href="/meals/all">Bekijk alle meals</a>

      <h2>5 random gerechten</h2>
      {loadingRandom && <p>Random gerechten laden...</p>}
      <ul>
        {randomMeals.map((meal) => (
          <li key={meal.idMeal}>
            <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} />
            <p>{meal.strMeal}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}