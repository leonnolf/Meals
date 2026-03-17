const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query: string) {
  const response = await fetch(`${BASE}/search.php?s=${query}`);
  const data = await response.json();
  return (data.meals ?? []) as Meal[];
}

export async function getMealById(id: string) {
  const response = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data = await response.json();
  return (data.meals?.[0] ?? null) as Meal | null;
}

export async function getRandomMeal() {
  const res = await fetch(`${BASE}/random.php`);
  const data = await res.json();
  return (data.meals?.[0] ?? null) as Meal | null;
}

export async function getAllMeals() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const responses = await Promise.all(
    letters.map(async (letter) => {
      const res = await fetch(`${BASE}/search.php?f=${letter}`);
      const data = await res.json();
      return (data.meals ?? []) as Meal[];
    })
  );

  const mealMap = new Map<string, Meal>();
  responses.flat().forEach((meal) => {
    mealMap.set(meal.idMeal, meal);
  });

  return Array.from(mealMap.values());
}

export async function getCategories() {
  const response = await fetch(`${BASE}/categories.php`);
  const data = await response.json();
  return (data.categories ?? []) as Category[];
}

export async function getIngredients() {
  const res = await fetch(`${BASE}/list.php?i=list`);
  const data = await res.json();
  console.log(data);
  return (data.meals ?? []).map((i: { strIngredient: string }) => i.strIngredient) as string[];
}

export async function getCountries() {
  const res = await fetch(`${BASE}/list.php?a=list`);
  const data = await res.json();
  return (data.meals ?? []).map((i: { strArea: string }) => i.strArea) as string[];
}

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strCountry: string;
  [key: string]: string;
};

export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
};

export async function getMealsByIngredients(ingredients: string[]) {
  if (ingredients.length === 0) return [];
  const results = await Promise.all(
    ingredients.map(async (i) => {
      const res = await fetch(`${BASE}/filter.php?i=${i.replace(/ /g, "_")}`);
      const data = await res.json();
      return (data.meals ?? []) as MealSummary[];
    })
  );
  return results.reduce((acc, curr) =>
    acc.filter((meal) => curr.some((m) => m.idMeal === meal.idMeal))
  );
}

export async function getMealsByCountry(country: string) {
  const res = await fetch(`${BASE}/filter.php?a=${country}`);
  const data = await res.json();
  return (data.meals ?? []) as MealSummary[];
}

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};