import Login from '../../pages/authentication/login';
import PublicRouteProtection from '../protection/PublicRouteProtection';

import ErrorPage from '../../pages/error-boundary/ErrorPage';

export const publicRoutes = [
    {
        path: '/login',
        errorElement: <ErrorPage />,
        element: (
            <PublicRouteProtection>
                <Login />
            </PublicRouteProtection>
        ),
    },
];
