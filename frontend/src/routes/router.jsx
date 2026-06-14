import { createBrowserRouter } from "react-router-dom";

import { publicRoutes } from "./all-routes/PublicRoutes";
import { userRoutes } from "./all-routes/UserRoutes";

export const router = createBrowserRouter([
  ...publicRoutes,
  ...userRoutes,
]);