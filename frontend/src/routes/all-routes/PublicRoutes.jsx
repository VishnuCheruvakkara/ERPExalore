import Login from '../../pages/authentication/login';
import PublicRouteProtection from '../protection/PublicRouteProtection';

export const publicRoutes = [
    {
        path: '/login',
        element: (
            <PublicRouteProtection>
                <Login />
            </PublicRouteProtection>
        ),
    },
];
