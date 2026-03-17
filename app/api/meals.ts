const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query: string) {
  const res = await fetch(`${BASE}/search.php?s=${query}`);
  const data = await res.json();
  return (data.meals ?? []) as Meal[];
}

export async function getMealById(id: string) {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  const data = await res.json();
  return (data.meals?.[0] ?? null) as Meal | null;
}

export async function getCategories() {
  const res = await fetch(`${BASE}/categories.php`);
  const data = await res.json();
  return (data.categories ?? []) as Category[];
}

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  [key: string]: string;
};

export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
};