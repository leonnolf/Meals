import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("meals/search", "routes/meals.search.tsx"),
  route("meals/all", "routes/meals.all.tsx"),
  route("meals/:id",    "routes/meals.$id.tsx"),
] satisfies RouteConfig;