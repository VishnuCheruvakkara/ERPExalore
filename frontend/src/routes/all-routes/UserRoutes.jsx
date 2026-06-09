import DashboardLayout from "../../layout/DashboardLayout";
import UserRouteProtection from "../protection/UserRouteProtection";

import Home from "../../pages/Dashboard/Home";

export const userRoutes = [
  {
    path: "/",
    element: (
      <UserRouteProtection>
        <DashboardLayout />
      </UserRouteProtection>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
];